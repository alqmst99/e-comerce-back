const Brand = require("../Models/brandModel");
const expressAsyncHandler = require("express-async-handler");
const validateMongosDBId = require("../Utils/validateMongodbid");

//*************************Api Rest Brand Controller *************************//

//Create Brand
const createBrand = expressAsyncHandler(async (req, res) => {
  try {
    const newBrand = await Brand.create(req.body);
    res.json({
      message: "success",
      newBrand,
    });
  } catch (error) {
    throw new Error(error);
  }
});

//Update Brand
const updateBrand = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  //validateMongosDBId(id : _id)
  try {
    const updateBrand = await Brand.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json({
      message: "success",
      updateBrand,
    });
  } catch (error) {
    throw new Error(error);
  }
});

//Get Brand
const getBrand = expressAsyncHandler(async (req, res) => {
  const { id } = body.params;
  try {
    const getBrand = await Brand.findById(id);
    res.json({
      message: "success",
      getBrand,
    });
  } catch (error) {
    throw new Error(error);
  }
});

//Get All Brand
const getABrand = expressAsyncHandler(async (req, res) => {
 
    try {
      const getABrand = await Brand.find();
      res.json({
        message: "success",
        getABrand,
      });
    } catch (error) {
      throw new Error(error);
    }
  });

//Delete Brand
const deleteBrand = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  //validateMongosDBId(id)
  try {
    const deleteBrand = await Brand.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json({
      message: "success",
      deleteBrand,
    });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = { createBrand, updateBrand, getBrand, getABrand,deleteBrand };
