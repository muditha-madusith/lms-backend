const connection = require("../config/db");
const generator = require("generate-password"); // for generate user password
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL, // Replace with your email
    pass: process.env.AppPass, // Replace with your password or app-specific password
  },
});

exports.registerUser = async (req, res) => {
  try {
    const { name, email, aId } = req.body;

    // Generate a password
    const plainPassword = generator.generate({
      length: 12,
      numbers: true,
      symbols: true,
    });

    // Hash the password
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // Execute the SQL query
    connection.query(
      "INSERT INTO users (name, email, password, aId) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, aId],
      (err, result) => {
        if (err) return res.status(400).json({ message: err.message });

        res.status(201).json({ message: "User registered!" });

        // Email options
        const mailOptions = {
          from: "Library Management System <kabmmadusith2003@gmail.com>",
          to: email,
          subject: "Registration Successful as User",
          text: `Hello ${name},\nYour registration is complete as User!\nEmail: ${email}\nPassword: ${plainPassword}\n\nThank you!\nPlease make sure to save your password. Because we don't have your password.`,
        };

        // Send the email
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error("Error sending email:", error);
          } else {
            console.log("Email sent: " + info.response);
          }
        });
      }
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.loginUser = (req, res) => {
  const { email, password } = req.body;

  // Check if the user exists
  connection.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Database query error", error: err.message });
      }

      if (results.length === 0) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const user = results[0];

      // Compare the hashed password with the input password
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Generate a JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        {
          expiresIn: "2h", // Token expires in 1 hour
        }
      );

      // Respond with success and the token
      res.status(200).json({
        message: "Login successful!",
        token: token,
        user: { id: user.id, name: user.name, email: user.email },
      });
    }
  );
};

exports.getAllUsers = (req, res) => {
  connection.query("SELECT * FROM users", (err, result) => {
    if (err) throw err;
    res.json(result);
  });
};

exports.getUserById = (req, res) => {
  const { id } = req.params;

  connection.query("SELECT * FROM users WHERE id = ?", [id], (err, result) => {
    if (err) throw err;
    res.json(result);
  });
};

exports.deleteUserById = (req, res) => {
    const { id } = req.params;
  
    connection.query("SELECT * FROM users WHERE id = ?", [id], (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      if (result.length === 0) return res.status(404).json({ message: "User not found" });
  
      const { name, email } = result[0];
  
      connection.query("DELETE FROM users WHERE id = ?", [id], (err, deleteResult) => {
        if (err) return res.status(500).json({ message: err.message });
  
        res.json({ message: "User delete successful" });
  
        // Email options
        const mailOptions = {
          from: "Library Management System <kabmmadusith2003@gmail.com>",
          to: email,
          subject: "Account Removed from LMS",
          text: `Hello ${name},\nYour account has been removed from LMS.\n\nThank you!`,
        };
  
        // Send the email
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) console.error("Error sending email:", error);
          else console.log("Email sent: " + info.response);
        });
      });
    });
  };