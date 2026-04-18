const Inquiry = require("../Models/enqModel");
const expressAsyncHandler = require("express-async-handler");
const validateMongosDBId = require("../Utils/validateMongodbid");

//*************************Api Rest Inquiry Controller *************************//

//Create Inquiry
const createInquiry = expressAsyncHandler(async (req, res) => {
  try {
    const newInquiry = await Inquiry?.create(req.body);
    res.json({
      message: "success",
      newInquiry,
    });
  } catch (error) {
    throw new Error(error);
  }
});

//Update Inquiry
const updateInquiry = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  //validateMongosDBId(id : _id)
  try {
    const updateInquiry = await Inquiry.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json({
      message: "success",
      updateInquiry,
    });
  } catch (error) {
    throw new Error(error);
  }
});

//Get Inquiry
const getInquiry = expressAsyncHandler(async (req, res) => {
  const { id } = body.params;
  try {
    const getInquiry = await Inquiry.findById(id);
    res.json({
      message: "success",
      getInquiry,
    });
  } catch (error) {
    throw new Error(error);
  }
});

//Get All Inquiry
const getAInquiry = expressAsyncHandler(async (req, res) => {
 
    try {
      const getAInquiry = await Inquiry.find();
      res.json({
        message: "success",
        getAInquiry,
      });
    } catch (error) {
      throw new Error(error);
    }
  });

//Delete Inquiry
const deleteInquiry = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  //validateMongosDBId(id)
  try {
    const deleteInquiry = await Inquiry.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json({
      message: "success",
      deleteInquiry,
    });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = { createInquiry, updateInquiry, getInquiry, getAInquiry,deleteInquiry };