const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const connection = require("../config/db");
const nodemailer = require("nodemailer");

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL, // Replace with your email
    pass: process.env.AppPass,  // Replace with your password or app-specific password
  },
});

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

  connection.query(
    "INSERT INTO admins (username, email, password) VALUES (?, ?, ?)",
    [name, email, hashedPassword],
    (err, results) => {
      if (err) return res.status(400).json({ message: err.message });
      res.status(201).json({ message: "Admin registered!" });
      // Send email to the admins is they register success..
      const mailOptions = {
        from: "Library Management System",
        to: email,
        subject: "Registration Successful as Admin",
        text: `Hello ${name},\nYour registration is complete as Admin!\nEmail: ${email}\nPassword: ${password}\n\nThank you!`,
      };

      transporter.sendMail(mailOptions); // Send the email
    }
  );
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  connection.query(
    "SELECT * FROM admins WHERE email = ?",
    [email],
    async (err, results) => {
      if (err || results.length === 0)
        return res.status(400).json({ message: "Invalid credentials" });

      const admin = results[0];
      const isPasswordValid = await bcrypt.compare(password, admin.password);

      if (!isPasswordValid)
        return res.status(400).json({ message: "Invalid credentials" });

      const token = jwt.sign(
        { id: admin.id, username: admin.username },
        process.env.JWT_SECRET,
        { expiresIn: "2h" }
      );
      res.json({ token });
    }
  );
};

exports.getadminById = (req, res) => {
    const { id } = req.params;

    connection.query("SELECT * FROM admins WHERE id = ?",
        [id],
        (err, result) => {
            if(err) throw err;
            res.json(result);
        }
    )
}