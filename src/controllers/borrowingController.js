const connection = require("../config/db");

exports.createBorrowing = (req, res) => {
    const {bId, uId, bDate, aId} = req.body;

    connection.query(
        "INSERT INTO borrowings (bId, uId, borrowDate, aId) VALUES (?, ?, ?, ?)",
        [bId, uId, bDate, aId],
        (err, result) => {
            if(err) throw err;
            res.status(201).json({message: "Borrowing success.."})
        }
    )
}

exports.updateBorrowing = (req, res) => {
    const {rDate} = req.body;
    const {id} = req.params;

    connection.query(
        "UPDATE borrowings SET returnDate = ? WHERE id = ?",
        [rDate, id],
        (err, result) => {
            if(err) throw err;
            res.json({ message: "Borrowing details update successfully.."});
        }
    )
}

exports.getBorrowingsByUserId = (req, res) => {
    const { userId } = req.query;

    connection.query(
        "SELECT * FROM borrowings WHERE uId = ?",
        [userId],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Error fetching borrowings." });
            }
            res.json(result);
        }
    );
};

exports.getBorrowingsByBookId = (req, res) => {
    const { bookId } = req.query;

    connection.query(
        "SELECT * FROM borrowings WHERE bId = ?",
        [bookId],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Error fetching borrowings." });
            }
            res.json(result);
        }
    );
};

exports.getBorrowingsByAdminId = (req, res) => {
    const { adminId } = req.query;

    connection.query(
        "SELECT * FROM borrowings WHERE aId = ?",
        [adminId],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Error fetching borrowings." });
            }
            res.json(result);
        }
    );
};