const express = require("express");
const router = express.Router();
const { createProduct, purchaseVariant, changePriceProduct, getProducts,getVariantsByProduct, getProductsByCategory,getProductsByName,getProductByID } = require("../controllers/productController");

// Importamos los middlewares
const { authenticateToken, authorizeAdmin, } = require("../middlewares/authMiddleware");
//Admins
router.post("/createProduct", authenticateToken, authorizeAdmin, createProduct);
router.post("/changePrice", authenticateToken, authorizeAdmin, changePriceProduct);
//Cualquier usuario
router.post("/purchase", authenticateToken, purchaseVariant);
//Trae todos los productos
router.get("/getProducts", authenticateToken, getProducts);
//Trae el producto con el id del producto enviado enviado
router.get("/getProductByID/:id", authenticateToken, getProductByID);
//Trae todos los productos con el nombre enviado
router.get("/getProductsByName/:name", authenticateToken, getProductsByName);
//Trae todos los productos con la categoria enviada
router.get("/getProductsByCategory/:category", authenticateToken, getProductsByCategory);
//Trae todas las variantes con el id del producto enviado
router.get("/getVariants", authenticateToken, getVariantsByProduct);
module.exports = router;
