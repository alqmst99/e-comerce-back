const express = require("express");
const { getOrders, getAllOrders, UpdateOrderStatus } = require("../Controllers/userController");
const { authMiddlewere, isAdmin } = require("../middlewares/authMiddlewere");
const router = express.Router();

router.get("/my-orders", authMiddlewere, getOrders);
router.get("/all-orders", authMiddlewere, isAdmin, getAllOrders);
router.put("/update-status/:id", authMiddlewere, isAdmin, UpdateOrderStatus);

module.exports = router;
