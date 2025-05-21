const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { authenticateToken, authorizeAdmin } = require("../middlewares/authMiddleware");

// Crear producto → solo admin
router.post("/products", authenticateToken, authorizeAdmin, productController.createProduct);

// Cambiar precio → solo admin
router.put("/products/:id/price", authenticateToken, authorizeAdmin, productController.changePrice);

// Ver productos → cualquiera (si lo permitís)
router.get("/products", productController.getAllProducts);

// Comprar → cliente logueado
router.post("/products/purchase", authenticateToken, productController.purchaseVariant);

module.exports = router;
