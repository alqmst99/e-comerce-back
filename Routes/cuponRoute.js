const express = require('express');
const {createCupon, updateCupon, deleteCupon, getCupon, getACupon}= require('../Controllers/cuponController');
const{ authMiddlewere, isAdmin}= require('../middlewares/authMiddlewere');
const router= express.Router();

//*************************Routes Product Cupon *************************//

//Create Cupon Router
router.post("/new", authMiddlewere, isAdmin, createCupon);

//Update Cupon Router
router.put('/update/:id', authMiddlewere, isAdmin, updateCupon);

//Get One Cupon
router.get('/:id', authMiddlewere, isAdmin, getCupon);

//Get One Cupon
router.get('/', authMiddlewere, isAdmin, getACupon);

//Delete Cupon Router
router.delete(':id', authMiddlewere, isAdmin, deleteCupon);

module.exports= router;
