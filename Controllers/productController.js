const Product = require("../Models/productModel");
const User= require('./../Models/userModel')
const asyncHandler = require("express-async-handler");
const fs = require('fs')
const cloudinaryUploadImg = require("./../Utils/cloudinary");
const slugify = require("slugify");

//*************************Api Rest Product Controller *************************/

//Create product
const createProduct = asyncHandler(async (req, res) => {
  if (req.body.title) {
    req.body.slug = slugify(req.body.title);
  }
  try {
    const newProduct = await Product.create(req.body);
    res.json(newProduct);
  } catch (error) {
    throw new Error(error);
  }
});

//Update Product
const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const updateProduct = await Product.findOneAndUpdate(
      { _id: id },
      req.body,
      { new: true }
    );
    // res.send('the update is successes')
    res.json(updateProduct);
  } catch (error) {
    throw new Error(error);
  }
});

//Delete Product
const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deleteProduct = await Product.findOneAndDelete(id);
    res.json(deleteProduct);
  } catch (error) {
    throw new Error(error);
  }
});

//Get One Products
const getAProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const findProduct = await Product.findById(id);
    res.json(findProduct);
  } catch (error) {
    throw new Error(error);
  }
});

//get All Product
const getAllProduct = asyncHandler(async (req, res) => {
  console.log(req.query);
  try {
    //Filter
    const queryObj = { ...req.query };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    let query = Product.find(JSON.parse(queryStr));

    //Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-credentAt");
    }

    //Limiting the fields

    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    //Pagination

    const page = req.query.page;
    const limit = req.query.limit;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      const productCount = await Product.countDocuments();
      if (skip >= productCount) throw new Error("this Pages doesnt exist");
    }
    console.log(page, limit, skip);
    const product = await query;
    res.json(product);
  } catch (error) {
    throw new Error(error);
  }
});
//Wish List

const addToWishList = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { proId } = req.body;
  try {
    const user = await User.findById(_id);
    const alreadyAdded = user.wishlist.find((id) => id.toString() === proId);
    if (alreadyAdded) {
      let user = await User.findOneAndUpdate(
        _id,
        {
          $push: { wishlist: proId },
        },
        {
          new: true,
        }
      );
      res.json(user);
    } else {
    }
  } catch (error) {
    throw new Error(error);
  }
});

//Rating Ratio
const rating = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { star, prodId, comment } = req.body;
  try {
    const product = await Product.findById(prodId);
    let allreadyRated = product.rating.find(
      (userId) => userId.postedby.toString() === _id.toString()
    );
    if (allreadyRated) {
      const updateRating = await Product.updateOne(
        {
          rating: { $elemMatch: allreadyRated },
        },
        {
          $set: { "rating.$.star": star, "rating.$.comment": comment },
        },
        {
          new: true,
        }
      );
    } else {
      const rateProduct = await Product.findByIdAndUpdate(
        prodId,
        {
          $push: {
            rating: {
              star: star,
              comment: comment,
              postedby: _id,
            },
          },
        },
        {
          new: true,
        }
      );
    }

    //All Ratings Oprations total, sum, actual num
    const getAllRatingns = await Product.findById(prodId);
    let totalRating = getAllRatingns.rating.length; //(Number the users rating)
    let ratingSum = getAllRatingns.rating
      .map((item) => item.star)
      .reduce((prev, curr) => prev + curr, 0); //number Stars
    let actualRating = Math.round(ratingSum / totalRating); //Modal, sumStars div totalStars
    let finalProduct = await Product.findByIdAndUpdate(
      prodId,
      {
        totalRating: actualRating, //actualice ratio Stars
      },
      {
        new: true,
      }
    );
    res.json(finalProduct);
  } catch (error) {
    throw new Error(error);
  }
});

//Upload Image
const uploadPImage = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const uploader = (path) => cloudinaryUploadImg(path, "images");
    const urls = [];
    const files = req.files;
    for (const file of files) {
      const { path } = file;
      const newPath = await uploader(path);
      urls.push(newPath);
      fs.unlinkSync(path);
    }
    const findProduct = await Product.findByIdAndUpdate(
      id,
      {
        images: urls.map((files) => {
          return files;
        }),
      },
      {
        new: true,
      }
    );
    res.json(findProduct);
  } catch (error) {
    throw new Error(error);
  }
});

//Get whisList
const getWishList= asyncHandler(async( req, res)=>{
  const {_id}= req.user;
  try {
    const findUser= await User.findById(_id).populate('wishlist');
    res.json(findUser);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createProduct,
  getAProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
  addToWishList,
  rating,
  uploadPImage,
  getWishList,
};
