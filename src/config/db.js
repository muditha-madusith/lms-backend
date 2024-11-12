const mysql = require("mysql2");
require("dotenv").config();

// Set up MySQL connection
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Database connected!");

  const createAdminsTableQuery = `
    CREATE TABLE IF NOT EXISTS admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        email VARCHAR(225) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL
    );
  `;

  // Create the tables if they don't exist
  const createUsersTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(100) NOT NULL,
        aId INT,
        CONSTRAINT fk_u_admin FOREIGN KEY (aId) REFERENCES admins(id) 
        ON DELETE SET NULL ON UPDATE CASCADE
    );
  `;
  // ON DELETE SET NULL: If an admin is deleted, the aId field in related users will be set to NULL.
  // ON UPDATE CASCADE: If the admin's ID changes, it will be updated automatically in the users table.

  //Create books table if they don't exist
  const createBooksTableQuery = `
    CREATE TABLE IF NOT EXISTS books (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(100) NOT NULL UNIQUE,
        author VARCHAR(150) NOT NULL,
        copies INT NOT NULL,
        aId INT,
        CONSTRAINT fk_admin FOREIGN KEY (aId) REFERENCES admins(id) 
        ON DELETE SET NULL ON UPDATE CASCADE
    );
  `;

  //Create borrowing table if they not exist
  const createBorrowingTableQuery = `
    CREATE TABLE IF NOT EXISTS borrowings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        bId INT,
        uId INT,
        borrowDate VARCHAR(250) NOT NULL,
        returnDate VARCHAR(250),
        aId INT,
        CONSTRAINT fk_a_admin FOREIGN KEY (aId) REFERENCES admins(id) 
        ON DELETE SET NULL ON UPDATE CASCADE,
        CONSTRAINT fk_us_admin FOREIGN KEY (uId) REFERENCES users(id) 
        ON DELETE SET NULL ON UPDATE CASCADE,
        CONSTRAINT fk_b_admin FOREIGN KEY (bId) REFERENCES books(id) 
        ON DELETE SET NULL ON UPDATE CASCADE 
    );
  `;

  // Execute the queries separately
  connection.query(createAdminsTableQuery, (err, result) => {
    if (err) {
      console.error("Failed to create the admins table:", err);
      return;
    }
    console.log('Table "admins" checked/created successfully');
  });

  connection.query(createBooksTableQuery, (err, result) => {
    if (err) {
      console.error("Failed to create the Books table:", err);
      return;
    }
    console.log('Table "Books" checked/created successfully');
  });

  connection.query(createUsersTableQuery, (err, result) => {
    if (err) {
      console.error("Failed to create the users table:", err);
      return;
    }
    console.log('Table "users" checked/created successfully');
  });

  connection.query(createBorrowingTableQuery, (err, result) => {
    if (err) {
      console.error("Failed to create the Borrowings table:", err);
      return;
    }
    console.log('Table "Borrowings" checked/created successfully');
  });
});

module.exports = connection;
