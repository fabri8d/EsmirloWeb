const { upload } = require("../middlewares/multerMiddleware");
const express = require("express");
const router = express.Router();
const { createProduct, purchaseVariant, changePriceProduct, getProducts,getVariantsByProduct, getProductsByCategory,getProductsByName,getProductByID, updateVariantStock, deleteProduct, deleteVariant, createVariant, getProductsFiltered } = require("../controllers/productController");

// Importamos los middlewares
const { authenticateToken, authorizeAdmin, } = require("../middlewares/authMiddleware");
//Admins


router.post("/createProduct",authenticateToken, authorizeAdmin, upload.single("image"), createProduct);


router.put("/changePrice/:id", authenticateToken, authorizeAdmin, changePriceProduct);
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
// Trae todas las variantes de un producto específico
router.get("/getVariantsByProduct/:id", authenticateToken, getVariantsByProduct);
// Modifica una variante de un producto
router.put("/updateVariantStock/:id", authenticateToken, authorizeAdmin, updateVariantStock);
router.delete("/deleteVariant/:id", authenticateToken, authorizeAdmin, deleteVariant);
router.delete("/deleteProduct/:id", authenticateToken, authorizeAdmin, deleteProduct);
router.post("/createVariant",authenticateToken, authorizeAdmin, createVariant)
router.get('/getProductsFiltered', authenticateToken, authorizeAdmin, getProductsFiltered);
module.exports = router;
