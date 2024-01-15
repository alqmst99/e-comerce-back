const express = require('express');
const {createBrand, updateBrand, deleteBrand, getBrand, getABrand}= require('../Controllers/brandController');
const{ authMiddlewere, isAdmin}= require('../middlewares/authMiddlewere');
const router= express.Router();

//*************************Routes Brand *************************//

//Create Brand Router
router.post("/new", authMiddlewere, isAdmin, createBrand);

//Update Brand Router
router.put('/update/:id', authMiddlewere, isAdmin, updateBrand);

//Get One Brand
router.get('/:id', authMiddlewere, isAdmin, getBrand);

//Get One Brand
router.get('/', authMiddlewere, isAdmin, getABrand);

//Delete Brand Router
router.delete(':id', authMiddlewere, isAdmin, deleteBrand);

module.exports= router;