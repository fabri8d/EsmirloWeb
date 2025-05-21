const express = require("express");
const router = express.Router();
const { authenticateToken, authorizeAdmin, } = require("../middlewares/authMiddleware");
const { getCategories, createCategory } = require("../controllers/categoryController.js");
router.post("/createCategory", authenticateToken, authorizeAdmin, createCategory);
router.get("/getCategories", authenticateToken, getCategories);
module.exports = router;
