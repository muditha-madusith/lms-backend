const express = require('express');
const router = express.Router();
const bookController = require("../controllers/bookController");
const authMiddleware = require('../middleware/auth');

router.post("/register-book", authMiddleware, bookController.registerBook);
router.get("/books", authMiddleware, bookController.getAllBooks);
router.get("/book/id", authMiddleware, bookController.getBookById);
router.put("/update-book/:id", authMiddleware, bookController.updateBook);
router.delete("/delete-boo/:id", authMiddleware, bookController.deleteBook);

module.exports = router;