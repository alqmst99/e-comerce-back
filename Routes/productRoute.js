const express = require("express");
const {
  createProduct,
  getAProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
  addToWishList,
  rating,
  uploadPImage,
} = require("../Controllers/productController");
const { imgProdUpload } = require("./../Utils/cloudinary");
const { isAdmin, authMiddlewere } = require("../middlewares/authMiddlewere");
const { uploadPhoto, ImgProdResize } = require("../middlewares/uploadImages");
const router = express.Router();

//*************************Routes Product *************************//

//Create product Route
router.post("/create", authMiddlewere, isAdmin, createProduct);

//Get one, all product Route

router.get("/:id", getAProduct);
router.get("/", getAllProduct);
//Upload product Image Route

router.put(
  "/upload/:id",
  authMiddlewere,
  isAdmin,
  uploadPhoto.array("images", 10),
  ImgProdResize,
  uploadPImage
);
//Update product Route

router.put("/:id", authMiddlewere, isAdmin, updateProduct);

//Add Wish List
router.put("/wishlist", authMiddlewere, addToWishList);

//Rating

router.put("/rating", authMiddlewere, rating);

//Delete product Route

router.delete("/:id", authMiddlewere, isAdmin, deleteProduct);

module.exports = router;
