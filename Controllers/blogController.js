const Blog= require('./../Models/blogModel');
const User =require('./../Models/userModel');
const asyncHandler = require('express-async-handler');
const validateMonfoDbId= require("../Utils/validateMongodbid");


const createBlog= asyncHandler( async (req, res)=>{
try {
    const newBlog= await Blog.create(req.body);
    res.json({
        status: "success",
        newBlog
    });

} catch (error) {
    throw new Error(error)
}
});


module.exports={createBlog}
