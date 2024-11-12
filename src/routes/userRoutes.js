const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require('../middleware/auth');

router.post("/register-user", authMiddleware, userController.registerUser);
router.post("/login-user", userController.loginUser);
router.get("/users", authMiddleware, userController.getAllUsers);
router.get("/user/:id", authMiddleware, userController.getUserById);
router.delete("/user/:id", authMiddleware, userController.deleteUserById);


module.exports = router;