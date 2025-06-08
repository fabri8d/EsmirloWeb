const express = require("express");
const router = express.Router();
const { authenticateToken, authorizeAdmin, } = require("../middlewares/authMiddleware");
const {
  addProductToCart,
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  updateCartStatus,
  getItemCount
} = require("../controllers/cartController.js");
router.post("/addProductToCart", authenticateToken, addProductToCart);
router.get("/getCart", authenticateToken, getCart);
router.put("/updateCartItem/:id", authenticateToken, updateCartItem);
router.put("/updateCartStatus/:id", authenticateToken, updateCartStatus);
router.delete("/removeCartItem/:id", authenticateToken, removeCartItem);
router.delete("/clearCart", authenticateToken, clearCart);
router.get("/getItemCount", authenticateToken, getItemCount);

module.exports = router;