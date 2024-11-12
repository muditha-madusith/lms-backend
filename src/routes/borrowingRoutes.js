const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const borrowingController = require("../controllers/borrowingController");

router.post("/create-borrowing", authMiddleware, borrowingController.createBorrowing);
router.put("/update-borrowing/:id", authMiddleware, borrowingController.updateBorrowing);
router.get("/borrows", borrowingController.getBorrowingsByUserId);



module.exports = router;