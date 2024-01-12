const Category = require("../Models/categoryModel");
const expressAsyncHandler = require("express-async-handler");
const validateMongosDBId = require("../Utils/validateMongodbid");

//*************************Api Rest Product Category Controller *************************//

//Create Category
const createCategory = expressAsyncHandler(async (req, res) => {
  try {
    const newCategory = await Category.create(req.body);
    res.json({
      message: "success",
      newCategory,
    });
  } catch (error) {
    throw new Error(error);
  }
});

//Update Category
const updateCategory = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  //validateMongosDBId(id : _id)
  try {
    const updateCategory = await Category.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json({
      message: "success",
      updateCategory,
    });
  } catch (error) {
    throw new Error(error);
  }
});

//Get Category
const getCategory = expressAsyncHandler(async (req, res) => {
  const { id } = body.params;
  try {
    const getCategory = await Category.findById(id);
    res.json({
      message: "success",
      getCategory,
    });
  } catch (error) {
    throw new Error(error);
  }
});

//Get All Category
const getACategory = expressAsyncHandler(async (req, res) => {
 
    try {
      const getACategory = await Category.find();
      res.json({
        message: "success",
        getACategory,
      });
    } catch (error) {
      throw new Error(error);
    }
  });

//Delete Category
const deleteCategory = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  //validateMongosDBId(id)
  try {
    const deleteCategory = await Category.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json({
      message: "success",
      deleteCategory,
    });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = { createCategory, updateCategory, getCategory, getACategory,deleteCategory };
