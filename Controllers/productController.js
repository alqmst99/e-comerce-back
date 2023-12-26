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
    const updateProduct = await Product.findOneAndUpdate({ _id:id}, req.body, {new: true});
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

//Get All Products
const getAProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const findProduct = await Product.findById(id);
    res.json(findProduct);
  } catch (error) {
    throw new Error(error);
  }
});

const getAllProduct = asyncHandler(async (req, res) => {
  try {
    const getAll = await Product.find();
    res.json(getAll);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = { createProduct, getAProduct, getAllProduct, updateProduct, deleteProduct };
