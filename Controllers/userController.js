const User = require("../Models/userModel");
const Product = require("../Models/productModel");
const Cart = require("../Models/cartModel");
const Cupon = require("../Models/cuponModel");
const Order = require("../Models/orderModel");
const asyncHandler = require("express-async-handler");
const { generateToken } = require("../Config/jwtToken");
const crypto = require("crypto");
const validateMongosDBId = require("../Utils/validateMongodbid");
const { refreshToken } = require("../Config/refreshToken");
const { JsonWebTokenError } = require("jsonwebtoken");
const jwt = require("jsonwebtoken");
const sendEmail = require("./emailController");
var uniquid= require('uniqid');

//*************************Api Rest USER Controller *************************//

//Create user
const createUser = asyncHandler(async (req, res, next) => {
  const email = req.body.email;
  const findUser = await User.findOne({ email: email });
  if (!findUser) {
    //create new user
    const newUser = await User.create(req.body);
    res.json(newUser);
  } else {
    //user a ready exists
    throw new Error("User already Exists");
    /*req.json({
             msg : "User Already Exists",
           success: false,
           error: 401
        })*/
  }
});

//Login user

const loginUserCtrl = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //check if user exists or not
  const findUser = await User.findOne({ email });
  if (findUser && (await findUser.isPasswordMatched(password))) {
    //const refreshToken = await refreshToken(findUser.id);
    const updateuser = await User.findByIdAndUpdate(
      findUser.id,
      {
        refreshToken: refreshToken,
      },
      {
        new: true,
      }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    res.json({
      _id: findUser?._id,
      firstName: findUser?.firstName,
      email: findUser?.email,
      mobile: findUser?.mobile,
      token: generateToken(findUser?._id),
    });
  } else {
    throw new Error("Inavalid Credentials");
  }
});

//admin login
const loginAdminCtrl = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //check if user exists or not
  const findAdmin = await User.findOne({ email });
  if (findUser && (await findAdmin.isPasswordMatched(password))) {
    const refreshToken = await refreshToken(findAdmin.id);
    if (findAdmin.rol !== "admin") throw new Error("Not Authorised");
    const updateuser = await User.findByIdAndUpdate(
      findAdmin.id,
      {
        refreshToken: refreshToken,
      },
      {
        new: true,
      }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    res.json({
      _id: findAdmin?._id,
      firstName: findAdmin?.firstName,
      email: findAdmin?.email,
      mobile: findAdmin?.mobile,
      token: generateToken(findAdmin?._id),
    });
  } else {
    throw new Error("Inavalid Credentials");
  }
});

// Handler Refresh token
const handlerRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie.refresToken) throw new Error("No Refresh Token in Cookies");
  const refreshToken = cookie.refresToken;
  const user = await User.findOne({ refreshToken });
  if (!user) throw new Error("No refresh Token present in Db or not mached");
  jwt.verify(
    refreshToken,
    process.env.JWT_SECRET,
    (err,
    (decode) => {
      if (err || user.id) {
        throw new Error("There is something wrong with refresh token");
      }
      const accessToken = generateTokenu(user?._id);
      res.json({ accessToken });
    })
  );
});

//Logout functionality

const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookie;
  if (cookie?.refresToken) throw new Error("No refresh Token in Cookies");
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    res.sendStatus(204); //forbidden
  }
  await User.findOneAndUpdate(refreshToken, {
    refresToken: "",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  res.sendStatus(204); //forbidden
});

//Update a user

const updateUser = asyncHandler(async (req, res) => {
  const { _id } = req.User;
  validateMongosDBId(_id);
  try {
    const getUser = await User.findByIdAndUpdate(
      id,
      {
        _id: req?._id,
        firstName: req?.firstName,
        email: req?.email,
        mobile: req?.mobile,
      },
      {
        new: true,
      }
    );
    res.json({
      updateUser,
    });
  } catch (error) {
    throw new Error(error);
  }
});

//Save user Address
const saveAddress = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongosDBId(_id);
  try {
    const UpdateUser = await User.findByIdAndUpdate(
      _id,
      {
        address: req?.body?.address,
      },
      {
        new: true,
      }
    );
  } catch (error) {
    throw new Error(error);
  }
});
// Get all users

const getaUser = asyncHandler(async (req, res) => {
  try {
    const getUsers = await User.find();
    res.json({
      getUsers,
    });
  } catch (error) {
    throw new Error(error);
  }
});

//Get Single User

const getUser = asyncHandler(async (req, res) => {
  const { id } = req.User._id;
  validateMongosDBId(_id);
  try {
    const getUser = await User.findById(id);
    res.json({
      getUser,
    });
  } catch (error) {
    throw new Error(error);
  }
});

//Delete User

const delUser = asyncHandler(async (req, res) => {
  const { id } = req.User._id;
  try {
    const delUser = await User.findByIdAndDelete(id);
    res.json({
      delUser,
    });
  } catch (error) {
    throw new Error(error);
  }
});

//Block and Unblock users
const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongosDBId(_id);
  try {
    const block = User.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      },
      {
        new: true,
      }
    );
    res.json({
      message: "user Blocked",
    });
  } catch (error) {
    throw new Error(error);
  }
});

//Unblock User
const unBlockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const block = User.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
      },
      {
        new: true,
      }
    );
    res.json({
      message: "user unBlocked",
    });
  } catch (error) {
    throw new Error(error);
  }
});

//Update Password
const updatePassword = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { password } = req.body;
  validateMongosDBId(_id);
  const user = await User.findById(_id);
  if (password) {
    user.password = password;
    const updatedPassword = await user.save();
    res.json(updatedPassword);
  } else {
    res.json(user);
  }
});

//Forgot password

const forgotPasswordToken = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found with this email");
  try {
    const token = await user.createPasswordResetToken();
    await user.save();
    const resetURL = `Hi, place follow this link to reset Your Password. this link is valid till 10 minutes from now. <a href='http://localhost:5000/api/user/reset-password/${token}>Click Here</a>`;
    const data = {
      to: email,
      text: "Hey user",
      subject: "Forgot Password",
      htm: resetURL,
    };
    sendEmail(data);
    res.json(token);
  } catch (error) {
    throw new Error(error);
  }
});

//Reset password

const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) throw new Error("Token Expired, Plase try again later");
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  res.json(user);
});
//whisList
const getwishList = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  try {
    const findUser = await User.findById(_id).populate("wishlist");
    res.json(findUser);
  } catch (error) {
    throw new Error(error);
  }
});

//Cart Order
const userCart = asyncHandler(async (req, res) => {
  const { cart } = req.body;
  const { _id } = req.user;

  validateMongosDBId(_id);
  try {
    let products = [];
    const user = await User.findById(_id);

    //check if user already have product
    const alreadyExistCart = await Cart.findOne({ orderby: user._id });
    if (alreadyExistCart) {
      alreadyExistCart.remove();
    }
    for (let i = 0; i < cart.length; i++) {
      let object = {};
      object.product = cart[i]._id;
      object.count = cart[i].count;
      object.color = cart[i].color;
      let getPrice = await Product.findById(cart[i]._id).select("price").exec();
      object.price = cart[i].price;
      products.push(object);
    }
    let cartTotal = 0;
    for (let i = 0; i < products.length; i++) {
      cartTotal = cartTotal + products[i].price * products[i].count;
    }
    res.json(newCart);
    let newCart = await new Cart({
      products,
      cartTotal,
      orderby: user?._id,
    }).save();
  } catch (error) {
    throw new Error(error);
  }
});
const getUserCart = asyncHandler(async (req, res) => {
  const {_id}= req.user;
  validateMongosDBId(_id);
  try {
    const cart= await Cart.findOne({orederby: _id}).populate("products.product");
    res.json(cart);
  } catch (error) {
    throw new Error(error);
  }
});

const emptyCart= asyncHandler( async (req, res)=>{
  const {_id}= req.user;
  validateMongosDBId(_id);
  try {
    const user= await User.findOne({ _id});
    const cart= await Cart.findByIdAndRemove({orederby:user._id})
    res.json(cart);
  } catch (error) {
    throw new Error(error);
  }
});

//Coupon
const applyCoupon= asyncHandler( async (req, res)=>{
const {coupon}= req.body;
const {_id}= req.user;
validateMongosDBId(_id);
const validCoupon= await Cupon.findOne({name:coupon});
if(validCoupon== null){
  throw new Error("Invalid Coupon")
}
const user= await User.findOne({_id});
let {cartTotal} = await Cart.findOne({orderby: user._id}).populate("products.product");
let totalAdterDiscount= (cartTotal - (cartTotal* validCoupon.discount)/100).toFixed(2);
await Cart.findOneAndUpdate({orderby: user._id}, {totalAdterDiscount}, {new:true});
res.json(totalAdterDiscount)
});

//Order

const createOrder= asyncHandler( async (req, res)=>{
const {COD, cuponApplied}= req.body;
const {_id}= req.user;
validateMongosDBId(_id);
try {
  if(!COD) throw new Error('Create cash order failed');
const user= await User.findById(_id);
let userCart= await Cart.findOne({orderby: user._id});
let finalAmount= 0;
if(cuponApplied && userCart.totalAfterDiscount){
  finalAmount= userCart.totalAfterDiscount *100
}else{
  finalAmount= userCart.cartTotal *100;
}

let newOrder = await new Order({
  product: userCart.products,
  paymentIntent:{
    //use uniqid
    id: uniquid(),
    method: "COD",
    amount: finalAmount,
    status: "Cash on Delivery",
    created: Date.now(),
    currency: "usd",
  },
  orderby: user._id,
  orderStatus:"Cash on Delivery",

}).save();
let update= userCart.products.map((item)=>{
  return{
    updateOne:{
      filter:{_id: item.product._id },
      update:{$inc: { quantity: -item.count, sold: +item.count}},
    },
  };
});
const updated = await Product.bulkWrite(update, {});
res.json({message: "success"});

} catch (error) {
  throw new Error(error);
}
});

const getOrders= asyncHandler ( async (req, res)=>{
  const {_id}= req.user;
  validateMongosDBId(_id);
  try {
    const userOrders = await Order.findOne({orderby:_id}).populate('products.product').exec();
    res.json(userOrders);
  } catch (error) {
    throw new Error(error);
  }
});

const UpdateOrderStatus= asyncHandler(async (req, res)=>{
const{status}= req.body;
const{id}=req.params;
validateMongosDBId(id);
try {
  const findOrder= await Order.findByIdAndUpdate(id, {
    orderStatus:status, 
    paymentIntent:{
    status:status,
  }
},
{new:true}
);
  res.json(findOrder);
} catch (error) {
  throw new Error(error);
}
});
module.exports = {
  createUser,
  loginAdminCtrl,
  loginUserCtrl,
  getaUser,
  getUser,
  delUser,
  updateUser,
  blockUser,
  unBlockUser,
  handlerRefreshToken,
  logout,
  updatePassword,
  forgotPasswordToken,
  resetPassword,
  saveAddress,
  getwishList,
  userCart,
  getUserCart,
  emptyCart,
  applyCoupon,
  createOrder,
  getOrders,
  UpdateOrderStatus,
};
