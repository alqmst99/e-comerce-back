const expressAsyncHandler = require('express-async-handler');
const User= require('../Models/userModel');
const asyncHandler =require('express-async-handler');
const { generateToken } = require('../Config/jwtToken');
const { parse } = require('dotenv');
const { param } = require('../Routes/authRoute');
const validateMongosDBId = require('../Utils/validateMongodbid');
const { refreshToken } = require('../Config/refreshToken');
const { JsonWebTokenError } = require('jsonwebtoken');
const jwt= require('jsonwebtoken')

// controllers for user: Login, register, views, validate

//create user
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

//login user

const loginUserCtrl= asyncHandler(async(req, res)=>{
    const {email, password}= req.body
    //check if user exists or not 
    const findUser= await User.find({email});
    if(findUser && await findUser.isPasswordMatched(password)) {
        const refreshToken= await refreshToken(findUser?.id);
        const updateuser= await User.findByIdAndUpdate(findUser.id,{
            refresToken: refreshToken, 
        },{
            new:true,
        })
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 72*60*60*1000,
        })
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

// handler Refresh token
const handlerRefreshToken = asyncHandler(async (req, res)=>{
const cookie= req.cookies;
if(!cookie.refresToken) throw new Error('No Refresh Token in Cookies');
const refreshToken= cookie.refresToken;
const user = await User.findOne({refreshToken});
if(!user) throw new Error("No refresh Token present in Db or not mached")
jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decode =>{
    if(err || user.id){
        throw new Error("There is something wrong with refresh token");
    }
    const accessToken = generateTokenu(user?._id);
    res.json({accessToken})

}))

})

//Logout functionality

const logout= asyncHandler(async (req,res)=>{
const cookie = req.cookie;
if(cookie?.refresToken) throw new Error("No refresh Token in Cookies");
const user= await User.findOne({refreshToken});
if(!user){
    res.clearCookie("refreshToken",{
        httpOnly:true,
        secure:true
    });
     res.sendStatus(204); //forbidden
}
await User.findOneAndUpdate(refreshToken,{
    refresToken: "",
} );
res.clearCookie("refreshToken", {
    httpOnly:true,
    secure: true,
});
 res.sendStatus(204); //forbidden
});

//Update a user

const updateUser= asyncHandler(async(req, res)=>{
    const {_id}= req.User;
    validateMongosDBId(_id)
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
    const {id}= req.User._id;
    validateMongosDBId(_id)
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
    const {id}= req.User._id;
    try {
        const delUser= await User.findByIdAndDelete(id);
        res.json({
            delUser});
    } catch (error) {
        throw new Error(error);
    }
});


//Block and Unblock users
const blockUser= asyncHandler( async(req, res)=>{
const {id}= req.params
validateMongosDBId(_id)
try {
    const block = User.findByIdAndUpdate(id, {
        isBlocked: true,
    },
    {
        new: true,
    }
    )
    res.json({
        message: "user Blocked"
    })
} catch (error) {
    throw new Error(error)
}
});
const unBlockUser= asyncHandler( async(req, res)=>{
    const {id}= req.params
try {
    const block = User.findByIdAndUpdate(id, {
        isBlocked: false,
    },
    {
        new: true,
    }
    )
    res.json({
        message: "user unBlocked"
    })
} catch (error) {
    throw new Error(error)
}
});

module.exports={createUser, loginUserCtrl,getaUser, getUser, delUser, updateUser, blockUser, unBlockUser, handlerRefreshToken, logout}