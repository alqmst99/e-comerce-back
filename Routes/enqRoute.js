const express = require("express");
const {
  createInquiry,
  updateInquiry,
  deleteInquiry,
  getInquiry,
  getAInquiry,
} = require("../Controllers/enqController");
const { authMiddlewere, isAdmin } = require("../middlewares/authMiddlewere");
const router = express.Router();

//*************************Routes Inquiry *************************//

//Create Inquiry Router
router.post("/new", authMiddlewere, isAdmin, createInquiry);

//Update Inquiry Router
router.put("/update/:id", authMiddlewere, isAdmin, updateInquiry);

//Get One Inquiry
router.get("/:id", authMiddlewere, isAdmin, getInquiry);

//Get One Inquiry
router.get("/", authMiddlewere, isAdmin, getAInquiry);

//Delete Inquiry Router
router.delete(":id", authMiddlewere, isAdmin, deleteInquiry);

module.exports = router;
