const Category = require("../Models/blogCatModel");
const expressAsyncHandler = require("express-async-handler");
const validateMongosDBId = require("../Utils/validateMongodbid");

//*************************Api Rest Blog Category Controller *************************//

//Create Category
const createBCategory = expressAsyncHandler(async (req, res) => {
  try {
    const newBCategory = await Category.create(req.body);
    res.json({
      message: "success",
      newBCategory,
    });
  } catch (error) {
    throw new Error(error);
  }
});

//Update Category
const updateBCategory = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  //validateMongosDBId(id : _id)
  try {
    const updateBCategory = await Category.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json({
      message: "success",
      updateBCategory,
    });
  } catch (error) {
    throw new Error(error);
  }
});

//Get Category
const getBCategory = expressAsyncHandler(async (req, res) => {
  const { id } = body.params;
  try {
    const getBCategory = await Category.findById(id);
    res.json({
      message: "success",
      getBCategory,
    });
  } catch (error) {
    throw new Error(error);
  }
});

//Get All Category
const getABCategory = expressAsyncHandler(async (req, res) => {
 
    try {
      const getABCategory = await Category.find();
      res.json({
        message: "success",
        getABCategory,
      });
    } catch (error) {
      throw new Error(error);
    }
  });

//Delete Category
const deleteBCategory = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  //validateMongosDBId(id)
  try {
    const deleteBCategory = await Category.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json({
      message: "success",
      deleteBCategory,
    });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = { createBCategory, updateBCategory, getBCategory, getABCategory,deleteBCategory };