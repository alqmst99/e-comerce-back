const User = require("../Models/userModel");
const Product = require("../Models/productModel");
const Cart = require("../Models/cartModel");
const Cupon = require("../Models/cuponModel");
const Order = require("../Models/orderModel");
const asyncHandler = require("express-async-handler");
const { generateToken } = require("../Config/jwtToken");
const { generateRefreshToken } = require("../Config/refreshToken");
const crypto = require("crypto");
const validateMongoDBId = require("../Utils/validateMongodbid");
const jwt = require("jsonwebtoken");
const sendEmail = require("./emailController");
var uniqid = require("uniqid");

// ─── CREATE USER ────────────────────────────────────────────────────────────
const createUser = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const findUser = await User.findOne({ email });
  if (findUser) throw new Error("User already exists");
  const newUser = await User.create(req.body);
  res.json(newUser);
});

// ─── LOGIN USER ─────────────────────────────────────────────────────────────
const loginUserCtrl = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const findUser = await User.findOne({ email });
  if (!findUser || !(await findUser.isPasswordMatched(password))) {
    throw new Error("Invalid credentials");
  }
  if (findUser.isBlocked) throw new Error("Your account has been blocked");
  const refreshToken = generateRefreshToken(findUser._id);
  await User.findByIdAndUpdate(findUser._id, { refreshToken }, { new: true });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 72 * 60 * 60 * 1000,
  });
  res.json({
    _id: findUser._id,
    firstName: findUser.firstName,
    lastName: findUser.lastName,
    email: findUser.email,
    mobile: findUser.mobile,
    role: findUser.role,
    token: generateToken(findUser._id),
  });
});

// ─── ADMIN LOGIN ─────────────────────────────────────────────────────────────
const loginAdminCtrl = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const findAdmin = await User.findOne({ email });
  if (!findAdmin || !(await findAdmin.isPasswordMatched(password))) {
    throw new Error("Invalid credentials");
  }
  if (findAdmin.role !== "admin") throw new Error("Not authorised");
  const refreshToken = generateRefreshToken(findAdmin._id);
  await User.findByIdAndUpdate(findAdmin._id, { refreshToken }, { new: true });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 72 * 60 * 60 * 1000,
  });
  res.json({
    _id: findAdmin._id,
    firstName: findAdmin.firstName,
    email: findAdmin.email,
    mobile: findAdmin.mobile,
    role: findAdmin.role,
    token: generateToken(findAdmin._id),
  });
});

// ─── REFRESH TOKEN ───────────────────────────────────────────────────────────
const handlerRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No Refresh Token in cookies");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) throw new Error("Refresh token not found in DB");
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err || user.id !== decoded.id)
      throw new Error("Invalid refresh token");
    const accessToken = generateToken(user._id);
    res.json({ accessToken });
  });
});

// ─── LOGOUT ──────────────────────────────────────────────────────────────────
const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No refresh token in cookies");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (user) {
    await User.findOneAndUpdate({ refreshToken }, { refreshToken: "" });
  }
  res.clearCookie("refreshToken", { httpOnly: true, secure: true });
  res.sendStatus(204);
});

// ─── GET ALL USERS ───────────────────────────────────────────────────────────
const getaUser = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password -refreshToken");
  res.json(users);
});

// ─── GET SINGLE USER ─────────────────────────────────────────────────────────
const getUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDBId(id);
  const user = await User.findById(id).select("-password -refreshToken");
  if (!user) throw new Error("User not found");
  res.json(user);
});

// ─── UPDATE USER ─────────────────────────────────────────────────────────────
const updateUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDBId(_id);
  const updated = await User.findByIdAndUpdate(
    _id,
    {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      mobile: req.body.mobile,
    },
    { new: true }
  ).select("-password -refreshToken");
  res.json(updated);
});

// ─── DELETE USER ─────────────────────────────────────────────────────────────
const delUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDBId(id);
  const deleted = await User.findByIdAndDelete(id);
  res.json(deleted);
});

// ─── BLOCK / UNBLOCK ─────────────────────────────────────────────────────────
const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDBId(id);
  await User.findByIdAndUpdate(id, { isBlocked: true }, { new: true });
  res.json({ message: "User blocked" });
});

const unBlockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDBId(id);
  await User.findByIdAndUpdate(id, { isBlocked: false }, { new: true });
  res.json({ message: "User unblocked" });
});

// ─── UPDATE PASSWORD ─────────────────────────────────────────────────────────
const updatePassword = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { password } = req.body;
  validateMongoDBId(_id);
  const user = await User.findById(_id);
  if (!password) throw new Error("Please provide a new password");
  user.password = password;
  const updated = await user.save();
  res.json({ message: "Password updated" });
});

// ─── FORGOT PASSWORD ─────────────────────────────────────────────────────────
const forgotPasswordToken = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found with this email");
  const token = await user.createPasswordResetToken();
  await user.save();
  const resetURL = `Hi ${user.firstName}, use this link to reset your password. Valid for 10 minutes: <a href='${process.env.CLIENT_URL}/reset-password/${token}'>Reset Password</a>`;
  const data = {
    to: email,
    text: "Hey User",
    subject: "Forgot Password Link",
    htm: resetURL,
  };
  sendEmail(data);
  res.json({ message: "Reset password email sent", token });
});

// ─── RESET PASSWORD ──────────────────────────────────────────────────────────
const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) throw new Error("Token expired, please try again");
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  res.json({ message: "Password reset successfully" });
});

// ─── SAVE ADDRESS ────────────────────────────────────────────────────────────
const saveAddress = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDBId(_id);
  const updated = await User.findByIdAndUpdate(
    _id,
    { address: req.body.address },
    { new: true }
  );
  res.json(updated);
});

// ─── WISHLIST ────────────────────────────────────────────────────────────────
const getwishList = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const user = await User.findById(_id).populate("wishlist");
  res.json(user.wishlist);
});

// ─── CART ────────────────────────────────────────────────────────────────────
const userCart = asyncHandler(async (req, res) => {
  const { cart } = req.body;
  const { _id } = req.user;
  validateMongoDBId(_id);

  const user = await User.findById(_id);
  // Remove existing cart
  const existingCart = await Cart.findOne({ orderby: user._id });
  if (existingCart) await existingCart.deleteOne();

  let products = [];
  for (let i = 0; i < cart.length; i++) {
    let obj = {};
    obj.product = cart[i]._id;
    obj.count = cart[i].count;
    obj.color = cart[i].color;
    const productPrice = await Product.findById(cart[i]._id)
      .select("price")
      .exec();
    obj.price = productPrice.price;
    products.push(obj);
  }

  let cartTotal = products.reduce((sum, p) => sum + p.price * p.count, 0);
  const newCart = await new Cart({ products, cartTotal, orderby: user._id }).save();
  res.json(newCart);
});

const getUserCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDBId(_id);
  const cart = await Cart.findOne({ orderby: _id }).populate("products.product");
  res.json(cart);
});

const emptyCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDBId(_id);
  const user = await User.findById(_id);
  const cart = await Cart.findOneAndDelete({ orderby: user._id });
  res.json(cart);
});

// ─── COUPON ──────────────────────────────────────────────────────────────────
const applyCoupon = asyncHandler(async (req, res) => {
  const { coupon } = req.body;
  const { _id } = req.user;
  validateMongoDBId(_id);
  const validCoupon = await Cupon.findOne({ name: coupon });
  if (!validCoupon) throw new Error("Invalid coupon");

  const user = await User.findById(_id);
  const { cartTotal } = await Cart.findOne({ orderby: user._id }).populate(
    "products.product"
  );
  const totalAfterDiscount = (
    cartTotal -
    (cartTotal * validCoupon.discount) / 100
  ).toFixed(2);

  await Cart.findOneAndUpdate(
    { orderby: user._id },
    { totalAfterDiscount },
    { new: true }
  );
  res.json(totalAfterDiscount);
});

// ─── ORDER ───────────────────────────────────────────────────────────────────
const createOrder = asyncHandler(async (req, res) => {
  const { COD, couponApplied } = req.body;
  const { _id } = req.user;
  validateMongoDBId(_id);
  if (!COD) throw new Error("Create cash order failed");

  const user = await User.findById(_id);
  const userCart = await Cart.findOne({ orderby: user._id });
  if (!userCart) throw new Error("No cart found");

  const finalAmount =
    couponApplied && userCart.totalAfterDiscount
      ? userCart.totalAfterDiscount * 100
      : userCart.cartTotal * 100;

  const newOrder = await new Order({
    products: userCart.products,
    paymentIntent: {
      id: uniqid(),
      method: "COD",
      amount: finalAmount,
      status: "Cash on Delivery",
      created: Date.now(),
      currency: "usd",
    },
    orderby: user._id,
    orderStatus: "Cash on Delivery",
  }).save();

  const bulkOps = userCart.products.map((item) => ({
    updateOne: {
      filter: { _id: item.product._id },
      update: { $inc: { quantity: -item.count, sold: +item.count } },
    },
  }));
  await Product.bulkWrite(bulkOps, {});
  res.json({ message: "Order created successfully", order: newOrder });
});

const getOrders = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDBId(_id);
  const orders = await Order.find({ orderby: _id })
    .populate("products.product")
    .exec();
  res.json(orders);
});

const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate("products.product")
    .populate("orderby", "firstName lastName email")
    .exec();
  res.json(orders);
});

const UpdateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;
  validateMongoDBId(id);
  const order = await Order.findByIdAndUpdate(
    id,
    { orderStatus: status, "paymentIntent.status": status },
    { new: true }
  );
  res.json(order);
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
  getAllOrders,
  UpdateOrderStatus,
};
