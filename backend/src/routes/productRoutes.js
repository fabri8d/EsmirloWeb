const express = require("express");
const router = express.Router();
const { createProduct, purchaseVariant, changePriceProduct, /*getCategories,*/ createCategory } = require("../controllers/productController");

// Importamos los middlewares
const { authenticateToken, authorizeAdmin, } = require("../middlewares/authMiddleware");
//Admins
router.post("/createProduct", authenticateToken, authorizeAdmin, createProduct);
router.post("/changePrice", authenticateToken, authorizeAdmin, changePriceProduct);
//Cualquier usuario
router.post("/purchase", authenticateToken, purchaseVariant);


module.exports = router;
