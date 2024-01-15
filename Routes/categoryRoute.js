const express = require('express');
const {createCategory, updateCategory, deleteCategory, getCategory, getACategory}= require('../Controllers/categoryController');
const{ authMiddlewere, isAdmin}= require('../middlewares/authMiddlewere');
const router= express.Router();

//*************************Routes Product Category *************************//

//Create Category Router
router.post("/new", authMiddlewere, isAdmin, createCategory);

//Update Category Router
router.put('/update/:id', authMiddlewere, isAdmin, updateCategory);

//Get One Category
router.get('/:id', authMiddlewere, isAdmin, getCategory);

//Get One Category
router.get('/', authMiddlewere, isAdmin, getACategory);

//Delete Category Router
router.delete(':id', authMiddlewere, isAdmin, deleteCategory);

module.exports= router;
