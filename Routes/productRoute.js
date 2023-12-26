const express = require("express");
const { createProduct, getAProduct, getAllProduct, updateProduct, deleteProduct } = require("../Controllers/productController");
const router = express.Router();

router.post('/create', createProduct);
router.get('/:id', getAProduct);
router.get('/', getAllProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;