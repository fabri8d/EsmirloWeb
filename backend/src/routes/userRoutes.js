const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticateToken, authorizeAdmin } = require("../middlewares/authMiddleware");
router.get("/getUsers", authenticateToken, authorizeAdmin, userController.getUsers);
router.get("/getUserById/:id", authenticateToken, authorizeAdmin, userController.getUserById);
router.get("/getUserByUsername/:username", authenticateToken, authorizeAdmin, userController.getUserByUsername);
router.delete("/deleteUser/:id", authenticateToken, authorizeAdmin, userController.deleteUser);
router.get("/getUsersFiltered", authenticateToken, authorizeAdmin, userController.getUsersFiltered);
module.exports = router;