const express = require("express");
const { createProduct, getAProduct } = require("../Controllers/productController");
const router = express.Router();

router.post("/create", createProduct);
router.get("/", getAProduct);




module.export = router;