const express = require("express");
const { createProduct, getAProduct, getAllProduct, updateProduct, deleteProduct } = require("../Controllers/productController");
const {isAdmin, authMiddlewere} = require('../middlewares/authMiddlewere');
const router = express.Router();

router.post('/create', authMiddlewere ,isAdmin, createProduct);
router.get('/:id', getAProduct);
router.get('/', getAllProduct);
router.put('/:id', authMiddlewere ,isAdmin, updateProduct);
router.delete('/:id', authMiddlewere ,isAdmin, deleteProduct);

module.exports = router;