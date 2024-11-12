const connection = require("../config/db");

exports.registerBook = (req, res) => {
    const {title, author, copies, adminId} = req.body;

    connection.query(
        "INSERT INTO books (title, author, copies, aId) VALUES (?, ?, ?, ?)",
        [title, author, copies, adminId],
        (err, results) => {
            if(err) return res.status(400).json({ message: err.message});
            res.status(201).json({ message: "Book register to the system success.."});
        }
    )
}

exports.getAllBooks = (req, res) => {
    connection.query(
        "SELECT * FROM books",
        (err, result) => {
            if(err) throw err;
            res.json(result);
        }
    )
}

exports.getBookById = (req, res) => {
    const {id} = req.params;

    connection.query(
        "SELECT * FROM books WHERE id = ?",
        [id],
        (err, result) => {
            if(err) throw err;
            res.json(result);
        }
    )
}

exports.updateBook = (req, res) => {
    const {title, author, copies, adminId} = req.body;
    const { id } = req.params;

    connection.query(
        "UPDATE books SET title = ?, author = ?, copies = ?, adminId = ?, WHERE id = ?",
        [title, author, copies, adminId, id],
        (err, result) => {
            if(err) throw err;
            res.json({ message: "Book details update successfully.."});
        }
    )
}

exports.deleteBook = (req, res) => {
    const {id} = req.params;

    connection.query(
        "DELETE FROM books WHERE id = ?",
        [id],
        (err, result) => {
            if(err) throw err;
            res.json({ message: "Book record delete successfull.." });
        }
    )
}