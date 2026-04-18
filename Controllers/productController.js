const Product = require("../Models/productModel");
const User = require("../Models/userModel");
const asyncHandler = require("express-async-handler");
const fs = require("fs");
const { cloudinaryUploadImg, cloudinaryDeleteImg } = require("../Utils/cloudinary");
const slugify = require("slugify");

// CREATE
const createProduct = asyncHandler(async (req, res) => {
  if (req.body.title) req.body.slug = slugify(req.body.title);
  const newProduct = await Product.create(req.body);
  res.json(newProduct);
});

// UPDATE
const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (req.body.title) req.body.slug = slugify(req.body.title);
  const updated = await Product.findByIdAndUpdate(id, req.body, { new: true });
  res.json(updated);
});

// DELETE
const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deleted = await Product.findByIdAndDelete(id);
  res.json(deleted);
});

// GET ONE
const getAProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id).populate("color");
  res.json(product);
});

// GET ALL (with filtering, sorting, pagination)
const getAllProduct = asyncHandler(async (req, res) => {
  const queryObj = { ...req.query };
  const excludeFields = ["page", "sort", "limit", "fields"];
  excludeFields.forEach((el) => delete queryObj[el]);

  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (m) => `$${m}`);
  let query = Product.find(JSON.parse(queryStr));

  // Sorting
  if (req.query.sort) {
    query = query.sort(req.query.sort.split(",").join(" "));
  } else {
    query = query.sort("-createdAt");
  }

  // Field limiting
  if (req.query.fields) {
    query = query.select(req.query.fields.split(",").join(" "));
  } else {
    query = query.select("-__v");
  }

  // Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const skip = (page - 1) * limit;
  query = query.skip(skip).limit(limit);

  const [products, total] = await Promise.all([
    query,
    Product.countDocuments(JSON.parse(queryStr)),
  ]);

  res.json({ products, total, page, pages: Math.ceil(total / limit) });
});

// WISHLIST
const addToWishList = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { proId } = req.body;
  const user = await User.findById(_id);
  const alreadyAdded = user.wishlist.find((id) => id.toString() === proId);

  if (alreadyAdded) {
    // Remove from wishlist
    const updated = await User.findByIdAndUpdate(
      _id,
      { $pull: { wishlist: proId } },
      { new: true }
    );
    res.json({ message: "Removed from wishlist", wishlist: updated.wishlist });
  } else {
    // Add to wishlist
    const updated = await User.findByIdAndUpdate(
      _id,
      { $push: { wishlist: proId } },
      { new: true }
    );
    res.json({ message: "Added to wishlist", wishlist: updated.wishlist });
  }
});

const getWishList = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const user = await User.findById(_id).populate("wishlist");
  res.json(user.wishlist);
});

// RATING
const rating = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { star, prodId, comment } = req.body;
  const product = await Product.findById(prodId);

  const alreadyRated = product.rating.find(
    (r) => r.postedby.toString() === _id.toString()
  );

  if (alreadyRated) {
    await Product.updateOne(
      { rating: { $elemMatch: alreadyRated } },
      { $set: { "rating.$.star": star, "rating.$.comment": comment } }
    );
  } else {
    await Product.findByIdAndUpdate(prodId, {
      $push: { rating: { star, comment, postedby: _id } },
    });
  }

  const updated = await Product.findById(prodId);
  const totalRating = updated.rating.length;
  const ratingSum = updated.rating.reduce((acc, r) => acc + r.star, 0);
  const actualRating = Math.round(ratingSum / totalRating);

  const finalProduct = await Product.findByIdAndUpdate(
    prodId,
    { totalRating: actualRating },
    { new: true }
  );
  res.json(finalProduct);
});

// UPLOAD IMAGE
const uploadPImage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const uploader = (path) => cloudinaryUploadImg(path, "images");
  const urls = [];
  for (const file of req.files) {
    const newPath = await uploader(file.path);
    urls.push(newPath);
    fs.unlinkSync(file.path);
  }
  const product = await Product.findByIdAndUpdate(
    id,
    { $push: { images: { $each: urls } } },
    { new: true }
  );
  res.json(product);
});

// DELETE IMAGE
const deletePImage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deleted = await cloudinaryDeleteImg(id, "images");
  res.json({ message: "Image deleted", deleted });
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
  deletePImage,
  getWishList,
};
