const express = require("express");
const sqlite3 = require("sqlite3");
const cookieParser = require("cookie-parser");

const app = express();
const port = 3000;
const path = require('path');

app.use(express.json());
app.use(cookieParser());

const db = new sqlite3.Database("path_to_your_database.db");

app.use(express.static(path.join(__dirname, "pages")));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "pages", "index.html"));
});

app.get("/product", function (req, res) {
    res.sendFile(path.join(__dirname, "pages", "product.html"));
  });

// Register a new user
app.post("/register", (req, res) => {
  const { email, phone, password } = req.body;

  if (email || phone) {
    db.run(
      "INSERT INTO users (email, phone, password) VALUES (?, ?, ?)",
      [email, phone, password],
      function (err) {
        if (err) {
          res.status(500).send("Failed to register user");
        } else {
          res.send("User registered successfully");
        }
      }
    );
  } else {
    res.status(400).send("Bad Request");
  }
});

// User login and create a cookie
app.post("/login", (req, res) => {
  const { emailphone, password } = req.body;

  db.get(
    "SELECT * FROM users WHERE email = ? OR phone = ? AND password = ?",
    [emailphone, password],
    (err, row) => {
      if (err) {
        res.status(500).send("Internal Server Error");
      } else if (row) {
        res.cookie("user", row[1], { maxAge: 900000000, httpOnly: true });
        res.send("Login successful");
      } else {
        res.status(401).send("Invalid email or password");
      }
    }
  );
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});