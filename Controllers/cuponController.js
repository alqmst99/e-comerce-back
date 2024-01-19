const Cupon= require('./../Models/cuponModel');
const validateMongoDbId= require('../Utils/validateMongodbid')
const asyncHandler = require("express-async-handler");

//*************************Api Rest Cupons Controller *************************/


//Create Cupon
const createCupon = asyncHandler(async (req, res) => {
    try {
      const newCupon = await Cupon.create(req.body);
      res.json({
        message: "success",
        newCupon,
      });
    } catch (error) {
      throw new Error(error);
    }
  });
  
  //Update Cupon
  const updateCupon = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongosDBId(id);
    try {
      const updateCupon = await Cupon.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      res.json({
        message: "success",
        updateCupon,
      });
    } catch (error) {
      throw new Error(error);
    }
  });
  
  //Get Cupon
  const getCupon = asyncHandler(async (req, res) => {
    const { id } = body.params;
    try {
      const getCupon = await Cupon.findById(id);
      res.json({
        message: "success",
        getCupon,
      });
    } catch (error) {
      throw new Error(error);
    }
  });
  
  //Get All Cupon
  const getACupon = asyncHandler(async (req, res) => {
   
      try {
        const getACupon = await Cupon.find();
        res.json({
          message: "success",
          getACupon,
        });
      } catch (error) {
        throw new Error(error);
      }
    });
  
  //Delete Cupon
  const deleteCupon = asyncHandler(async (req, res) => {
    const { id } = req.params;
    //validateMongosDBId(id);
    try {
      const deleteCupon = await Cupon.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      res.json({
        message: "success",
        deleteCupon,
      });
    } catch (error) {
      throw new Error(error);
    }
  });
  module.exports ={createCupon, updateCupon, getCupon,getACupon ,deleteCupon};
  


