const expressAsyncHandler = require('express-async-handler');
const User= require('../Models/userModel');
const asyncHandler =require('express-async-handler')
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
        res.json(findUser)
    }else{
        throw new Error("Inavalid Credentials")
    }

})

module.exports={createUser, loginUserCtrl}