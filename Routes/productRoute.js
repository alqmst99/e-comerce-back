const express = require("express");
const { createProduct, getAProduct, getAllProduct, updateProduct, deleteProduct, addToWishList, rating } = require("../Controllers/productController");
const {isAdmin, authMiddlewere} = require('../middlewares/authMiddlewere');
const router = express.Router();

//*************************Routes Product *************************//

//Create product Route
router.post('/create', authMiddlewere ,isAdmin, createProduct);

//Get one, all product Route

router.get('/:id', getAProduct);
router.get('/', getAllProduct);

//Update product Route

router.put('/:id', authMiddlewere ,isAdmin, updateProduct);

//Add Wish List
router.put('/wishlist', authMiddlewere ,isAdmin, addToWishList);

//Rating

router.put('/rating', authMiddlewere ,isAdmin, rating);

//Delete product Route

router.delete('/:id', authMiddlewere ,isAdmin, deleteProduct);

module.exports = router;