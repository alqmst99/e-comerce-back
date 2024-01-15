const Cupons= require('./../Models/cuponModel');
const validateMongoDbId= require('../Utils/validateMongodbid')
const asyncHandler = require("express-async-handler");

//*************************Api Rest Cupons Controller *************************/


//Create Cupon
const createCupon = expressAsyncHandler(async (req, res) => {
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
  const updateCupon = expressAsyncHandler(async (req, res) => {
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
  const getCupon = expressAsyncHandler(async (req, res) => {
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
  const getACupon = expressAsyncHandler(async (req, res) => {
   
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
  const deleteCupon = expressAsyncHandler(async (req, res) => {
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
  exports.defauld ={createCupon, updateCupon, getCupon,getACupon,deleteCupon};
  


