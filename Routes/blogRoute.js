const express = require("express");
const {
  createBlog,
  UpdateBlog,
  getBlog,
  getABlog,
  deleteBlog,
  likeABlog,
  DislikeABlog,
  uploadBImage,
} = require("../Controllers/blogController");
const { authMiddlewere, isAdmin } = require("../middlewares/authMiddlewere");

const { uploadPhoto, ImgBlogResize } = require("../middlewares/uploadImages");
const router = express.Router();

//*************************Routes Blog *************************//

//create Blog Route
router.post("/new", authMiddlewere, isAdmin, createBlog);

//Update Blog Route
router.put("/update/:id", authMiddlewere, isAdmin, UpdateBlog);

//Like Blog Route
router.put("/likes", authMiddlewere, likeABlog);

//Upload product Image Route

router.put(
  "/upload/:id",
  authMiddlewere,
  isAdmin,
  uploadPhoto.array("images", 2),
  ImgBlogResize,
  uploadBImage
);

//Dislike Blog Route
router.put("/dislikes", authMiddlewere, DislikeABlog);

// Get One Blog Route
router.get("/:id", getBlog);

//Get All Blog Route
router.get("/", getABlog);

//Delete Blog Route
router.delete("/:id", authMiddlewere, isAdmin, deleteBlog);

module.exports = router;
