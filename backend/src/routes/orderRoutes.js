const express = require("express");
const router = express.Router();
const { authenticateToken, authorizeAdmin, } = require("../middlewares/authMiddleware");
const { getAllOrders, createOrder, getOrderById, updateOrderStatus, cancelOrder, getOrdersByUserId,getOrdersByUsername } = require("../controllers/orderController.js");
router.post("/createOrder", authenticateToken, createOrder);
router.get("/getOrders", authenticateToken, authorizeAdmin, getAllOrders);
router.get("/getOrderById/:id", authenticateToken, getOrderById);
router.put("/updateOrderStatus/:id", authenticateToken, authorizeAdmin, updateOrderStatus);
router.delete("/cancelOrder/:id", authenticateToken, cancelOrder);
router.get("/getOrdersByUserId/:userId", authenticateToken, getOrdersByUserId);
router.get("/getOrdersByUsername/:username", authenticateToken, getOrdersByUsername);
module.exports = router;
