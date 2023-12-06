const Product = require("../Models/productModel");
const asyncHandler= require("express-async-handler");

//Create product
const createProduct =asyncHandler( async (req, res)=>{
    try {
        const newProduct= await new Product.create(req.body);
        res.json(newProduct);
    } catch (error) {
        throw new Error(error);
    }


});

//Get All Products
const getAProduct = asyncHandler(async (req, res)=>{
    const {id}=req.params;
    try {
        const findProduct= await Product.findById(id)
        res.json(findProduct);
    } catch (error) {
        throw new Error(error);
    }
});


const getAllProduct = asyncHandler(async (req, res)=>{
    try {
        
    } catch (error) {
        throw new Error(error);
    }
})




module.exports={createProduct, getAProduct};