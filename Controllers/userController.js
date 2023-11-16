const expressAsyncHandler = require('express-async-handler');
const User= require('../Models/userModel');
const asyncHandler =require('express-async-handler');
const { generateToken } = require('../Config/jwtToken');
const { parse } = require('dotenv');
const { param } = require('../Routes/authRoute');
const createUser= asyncHandler( async (req, res, next) =>{
    const email= req.body.email;
    const findUser= await User.findOne({email:email});
    if(!findUser){
        //create new user
        const newUser= await User.create(req.body);
        res.json(newUser)
    }else{
        //user a ready exists
        throw new Error ("User already Exists")
        /*req.json({
             msg : "User Already Exists",
           success: false,
           error: 401
        })*/
    }

})
const loginUserCtrl= asyncHandler(async(req, res)=>{
    const {email, password}= req.body
    //check if user exists or not 
    const findUser= await User.find({email});
    if(findUser && await findUser.isPasswordMatched(password)) {
        res.json({
            _id : findUser?._id,
            firstName: findUser?.firstName,
            email: findUser?.email,
            mobile: findUser?.mobile,
            token: generateToken(findUser?._id),
            })
    }else{
        throw new Error("Inavalid Credentials")
    }

});
//Update a user

const updateUser= asyncHandler(async(req, res)=>{
    const {id}= req.params._id;
    try {
        const getUser= await User.findByIdAndUpdate(id, {
            _id : req?._id,
            firstName: req?.firstName,
            email: req?.email,
            mobile: req?.mobile,
        }, 
        { 
            new: true,
        });
        res.json({
            updateUser});
    } catch (error) {
        throw new Error(error);
    }
})



// Get all users

const getaUser = asyncHandler( async(req, res)=>{
  
  try {
    const getUsers= await User.find();
    res.json({
        getUsers});
  } catch (error) {
    throw new Error(error)
  }
});

//Get Single User

const getUser= asyncHandler(async(req, res)=>{
    const {id}= req.params._id;
    try {
        const getUser= await User.findById(id);
        res.json({
            getUser});
    } catch (error) {
        throw new Error(error);
    }
})

//Delete User

const delUser= asyncHandler(async(req, res)=>{
    const {id}= req.params._id;
    try {
        const delUser= await User.findByIdAndDelete(id);
        res.json({
            delUser});
    } catch (error) {
        throw new Error(error);
    }
})

module.exports={createUser, loginUserCtrl,getaUser, getUser, delUser, updateUser}