const express = require('express');
const { createBlog } = require('../Controllers/blogController');
const { authMiddlewere, isAdmin } = require('../middlewares/authMiddlewere');
const router= express.Router();

router.post('/new',authMiddlewere, isAdmin, createBlog);

module.exports= router;
