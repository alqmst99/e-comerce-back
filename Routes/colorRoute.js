const express = require("express");
const {
  createColor,
  updateColor,
  deleteColor,
  getColor,
  getAColor,
} = require("../Controllers/colorController");
const { authMiddlewere, isAdmin } = require("../middlewares/authMiddlewere");
const router = express.Router();

//*************************Routes Color *************************//

//Create Color Router
router.post("/new", authMiddlewere, isAdmin, createColor);

//Update Color Router
router.put("/update/:id", authMiddlewere, isAdmin, updateColor);

//Get One Color
router.get("/:id", authMiddlewere, isAdmin, getColor);

//Get One Color
router.get("/", authMiddlewere, isAdmin, getAColor);

//Delete Color Router
router.delete(":id", authMiddlewere, isAdmin, deleteColor);

module.exports = router;
