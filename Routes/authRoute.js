const express = require("express");
const {
  createUser, loginUserCtrl, getUser, delUser, updateUser, getaUser,
  blockUser, unBlockUser, handlerRefreshToken, logout, updatePassword,
  forgotPasswordToken, resetPassword, loginAdminCtrl, saveAddress,
  userCart, getUserCart, emptyCart, applyCoupon, createOrder, getOrders,
  getAllOrders, UpdateOrderStatus,
} = require("../Controllers/userController");
const router = express.Router();
const { authMiddlewere, isAdmin } = require("../middlewares/authMiddlewere");
const { getWishList } = require("../Controllers/productController");

// Auth
router.post("/register", createUser);
router.post("/login", loginUserCtrl);
router.post("/admin-login", loginAdminCtrl);
router.get("/refresh", handlerRefreshToken);
router.get("/logout", logout);

// Password
router.post("/forgot-password-token", forgotPasswordToken);
router.put("/reset-password/:token", resetPassword);
router.put("/password", authMiddlewere, updatePassword);

// User CRUD
router.get("/all-users", authMiddlewere, isAdmin, getaUser);
router.get("/wishlist", authMiddlewere, getWishList);
router.get("/:id", authMiddlewere, isAdmin, getUser);
router.put("/address", authMiddlewere, saveAddress);
router.put("/update-user", authMiddlewere, updateUser);
router.delete("/delete/:id", authMiddlewere, isAdmin, delUser);

// Admin block
router.put("/blocked-user/:id", authMiddlewere, isAdmin, blockUser);
router.put("/unblocked-user/:id", authMiddlewere, isAdmin, unBlockUser);

// Cart
router.post("/cart", authMiddlewere, userCart);
router.get("/cart/get", authMiddlewere, getUserCart);
router.delete("/cart", authMiddlewere, emptyCart);
router.post("/cart/applycoupon", authMiddlewere, applyCoupon);

// Orders
router.post("/cart/cash-order", authMiddlewere, createOrder);
router.get("/get/orders", authMiddlewere, getOrders);
router.get("/get/all-orders", authMiddlewere, isAdmin, getAllOrders);
router.put("/order/update/:id", authMiddlewere, isAdmin, UpdateOrderStatus);

module.exports = router;
