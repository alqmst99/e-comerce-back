const Iquiry = require("../Models/enqModel");
const expressAsyncHandler = require("express-async-handler");
const validateMongosDBId = require("../Utils/validateMongodbid");

//*************************Api Rest Iquiry Controller *************************//

//Create Iquiry
const createIquiry = expressAsyncHandler(async (req, res) => {
  try {
    const newIquiry = await Iquiry.create(req.body);
    res.json({
      message: "success",
      newIquiry,
    });
  } catch (error) {
    throw new Error(error);
  }
});

//Update Iquiry
const updateIquiry = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  //validateMongosDBId(id : _id)
  try {
    const updateIquiry = await Iquiry.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json({
      message: "success",
      updateIquiry,
    });
  } catch (error) {
    throw new Error(error);
  }
});

//Get Iquiry
const getIquiry = expressAsyncHandler(async (req, res) => {
  const { id } = body.params;
  try {
    const getIquiry = await Iquiry.findById(id);
    res.json({
      message: "success",
      getIquiry,
    });
  } catch (error) {
    throw new Error(error);
  }
});

//Get All Iquiry
const getAIquiry = expressAsyncHandler(async (req, res) => {
 
    try {
      const getAIquiry = await Iquiry.find();
      res.json({
        message: "success",
        getAIquiry,
      });
    } catch (error) {
      throw new Error(error);
    }
  });

//Delete Iquiry
const deleteIquiry = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  //validateMongosDBId(id)
  try {
    const deleteIquiry = await Iquiry.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json({
      message: "success",
      deleteIquiry,
    });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = { createIquiry, updateIquiry, getIquiry, getAIquiry,deleteIquiry };