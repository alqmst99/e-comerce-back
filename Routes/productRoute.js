const express = require("express");
const { createProduct, getAProduct, getAllProduct } = require("../Controllers/productController");
const router = express.Router();

router.post('/create', createProduct);
router.get('/', getAProduct);
router.get('/all', getAllProduct);

module.exports = router;