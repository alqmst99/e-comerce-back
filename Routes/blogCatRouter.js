const express = require('express');
const {createBCategory, updateBCategory, deleteBCategory, getBCategory, getABCategory}= require('../Controllers/blogCatController');
const{ authMiddlewere, isAdmin}= require('../middlewares/authMiddlewere');
const router= express.Router();

//*************************Routes Blog Category *************************//

//Create Category Router
router.post("/new", authMiddlewere, isAdmin, createBCategory);

//Update Category Router
router.put('/update/:id', authMiddlewere, isAdmin, updateBCategory);

//Get One Category
router.get('/:id', authMiddlewere, isAdmin, getBCategory);

//Get One Category
router.get('/', authMiddlewere, isAdmin, getABCategory);

//Delete Category Router
router.delete(':id', authMiddlewere, isAdmin, deleteBCategory);

module.exports= router;