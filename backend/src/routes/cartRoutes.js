const express = require("express");
const router = express.Router();
const { authenticateToken, authorizeAdmin, } = require("../middlewares/authMiddleware");
const {
  addProductToCart,
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  updateCartStatus
} = require("../controllers/cartController.js");
router.post("/addProductToCart", authenticateToken, addProductToCart);
router.get("/getCart", authenticateToken, getCart);
router.put("/updateCartItem/:id", authenticateToken, updateCartItem);
router.put("/updateCartStatus/:id", authenticateToken, updateCartStatus);
router.delete("/removeCartItem/:id", authenticateToken, removeCartItem);
router.delete("/clearCart", authenticateToken, clearCart);
module.exports = router;