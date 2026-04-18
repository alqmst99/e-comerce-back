const express = require('express');
const {createCupon, updateCupon, getCupon, getACupon, deleteCupon}= require('../Controllers/cuponController');
const{ authMiddlewere, isAdmin}= require('../middlewares/authMiddlewere');
const router= express.Router();

//*************************Routes Product Cupon *************************//

//Create Cupon Router
 router.post('/new', authMiddlewere, isAdmin, createCupon);

//Update Cupon Router
router.put('/update/:id', authMiddlewere, isAdmin, updateCupon);

//Get One Cupon
router.get('/:id',  getCupon);

//Get One Cupon Router
router.get('/', getACupon);

//Delete Cupon Router
router.delete(':id', authMiddlewere, isAdmin, deleteCupon);

module.exports= router;
