const Product = require("../Models/productModel");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");

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

    if(req.query.fields){
      const fields =req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else{
      query = query.select("-__v")
    }

    //Pagination

    const page= req.query.page;
    const limit= req.query.limit;
    const skip = (page - 1)*limit;
    query= query.skip(skip).limit(limit);
    if(req.query.page){
      const productCount= await Product.countDocuments();
      if(skip>=productCount) throw new Error ('this Pages doesnt exist');
    }
    console.log(page, limit, skip);
    const product = await query;
    res.json(product);
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
};
