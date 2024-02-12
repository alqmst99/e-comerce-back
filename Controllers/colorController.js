const Color = require("../Models/colorModel");
const expressAsyncHandler = require("express-async-handler");
const validateMongosDBId = require("../Utils/validateMongodbid");

//*************************Api Rest Color Controller *************************//

//Create Color
const createColor = expressAsyncHandler(async (req, res) => {
  try {
    const newColor = await Color.create(req.body);
    res.json({
      message: "success",
      newColor,
    });
  } catch (error) {
    throw new Error(error);
  }
});

//Update Color
const updateColor = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  //validateMongosDBId(id : _id)
  try {
    const updateColor = await Color.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json({
      message: "success",
      updateColor,
    });
  } catch (error) {
    throw new Error(error);
  }
});

//Get Color
const getColor = expressAsyncHandler(async (req, res) => {
  const { id } = body.params;
  try {
    const getColor = await Color.findById(id);
    res.json({
      message: "success",
      getColor,
    });
  } catch (error) {
    throw new Error(error);
  }
});

//Get All Color
const getAColor = expressAsyncHandler(async (req, res) => {
 
    try {
      const getAColor = await Color.find();
      res.json({
        message: "success",
        getAColor,
      });
    } catch (error) {
      throw new Error(error);
    }
  });

//Delete Color
const deleteColor = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  //validateMongosDBId(id)
  try {
    const deleteColor = await Color.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json({
      message: "success",
      deleteColor,
    });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = { createColor, updateColor, getColor, getAColor,deleteColor };
