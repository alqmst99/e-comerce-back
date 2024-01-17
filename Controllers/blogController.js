const Blog = require("./../Models/blogModel");
const User = require("./../Models/userModel");
const asyncHandler = require("express-async-handler");
const validateMonfoDbId = require("../Utils/validateMongodbid");
const validateMongosDBId = require("../Utils/validateMongodbid");

//*************************Api Rest Blog Controller *************************//

//Create Bolg
const createBlog = asyncHandler(async (req, res) => {
  try {
    const newBlog = await Blog.create(req.body);
    res.json({
      status: "success",
      newBlog,
    });
  } catch (error) {
    throw new Error(error);
  }
});

//Update
const UpdateBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  //validateMongosDBId(id);
  try {
    const updateBlog = await Blog.findOneAndUpdate(id, req.body, {
      new: true,
    });
    res.json({
      status: "success",
      updateBlog,
    });
  } catch (error) {
    throw new Error(error);
  }
});

//getOneBlog

const getBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  //validateMongosDBId(id);
  try {
    const getBlog = await Blog.findById(id)
      .populate("likes")
      .populate("dislikes");
    const updateViews = await Blog.findByIdAndUpdate(
      id,
      {
        $inc: { numViews: 1 }, // aggre views
      },
      { new: true }
    );
    res.json({
      status: "success",
      getBlog,
      updateViews,
    });
  } catch (error) {
    throw new Error(error);
  }
});

//Get All Blogs

const getABlog = asyncHandler(async (req, res) => {
  try {
    const getABlog = await Blog.find();
    res.json({
      status: "success",
      getABlog,
    });
  } catch (error) {
    throw new Error(error);
  }
});

//Delete Blog

const deleteBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  //validateMongosDBId(id);
  try {
    const deleteBlog = await Blog.findByIdAndDelete(id);
    res.json({
      status: "success",
      deleteBlog,
    });
  } catch (error) {
    throw new Error(error);
  }
});

//Like Blog <3
const likeABlog = asyncHandler(async (req, res) => {
  const { blogId } = req.body;

  //validateMongosDBId(blogId);

  //find the blog whitch tou want to be liked
  const blog = await Blog.findById(blogId);

  //find the login user
  const loginUserId = req?.user?._id;

  //find if the user has liked the blog
  const isLiked = blog?.isLiked;

  //find the user is he disliked the blog
  const alreadyDisliked = blog?.dislikes?.find(
    (userId) => userId?.toString() === loginUserId?.toString()
  );
  if (alreadyDisliked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { dislikes: loginUserId },
        isDisliked: false,
      },
      { new: true }
    );
    res.json(blog);
  }
  if (isLiked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      { new: true }
    );
    res.json(blog);
  } else {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $push: { likes: loginUserId },
        isLiked: true,
      },
      { new: true }
    );
    res.json(blog);
  }
});

// Dislike Blog
const DislikeABlog = asyncHandler(async (req, res) => {
  const { blogId } = req.body;
  // validateMongosDBId(blogId);

  //find the blog whitch tou want to be liked
  const blog = await Blog.findById(blogId);

  //find the login user
  const loginUserId = req?.user?._id;

  //find if the user has disliked the blog
  const isDisliked = blog?.isDisliked;

  //find the user is he liked the blog
  const alreadyLiked = blog?.dislikes?.find(
    (userId) => userId?.toString() === loginUserId?.toString()
  );
  if (alreadyLiked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      { new: true }
    );
    res.json(blog);
  }
  if (isDisliked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { dislikes: loginUserId },
        isDisliked: false,
      },
      { new: true }
    );
    res.json(blog);
  } else {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $push: { dislikes: loginUserId },
        isDisliked: true,
      },
      { new: true }
    );
    res.json(blog);
  }
});

//Upload Image
const uploadBImage = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const uploader = (path) => cloudinaryUploadImg(path, "images");
    const urls = [];
    const files = req.files;
    for (const file of files) {
      const { path } = file;
      const newPath = await uploader(path);
      urls.push(newPath);
    }
    const findProduct = await Blog.findByIdAndUpdate(
      id,
      {
        images: urls.map((files) => {
          return files;
        }),
      },
      {
        new: true,
      }
    );
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createBlog,
  UpdateBlog,
  getBlog,
  getABlog,
  deleteBlog,
  likeABlog,
  DislikeABlog,
  uploadBImage,
};
