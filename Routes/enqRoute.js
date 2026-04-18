const express = require("express");
const { createEnquiry, updateEnquiry, deleteEnquiry, getEnquiry, getallEnquiry } = require("../Controllers/enqController");
const { authMiddlewere, isAdmin } = require("../middlewares/authMiddlewere");
const router = express.Router();

router.post("/", createEnquiry);
router.put("/:id", authMiddlewere, isAdmin, updateEnquiry);
router.delete("/:id", authMiddlewere, isAdmin, deleteEnquiry);
router.get("/:id", getEnquiry);
router.get("/", getallEnquiry);

module.exports = router;
