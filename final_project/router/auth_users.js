const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];
const secretKey = "Yaman.js";

const isValid = (username) => {
  return users.some((user) => user.username === username);
};

const authenticatedUser = (username, password) => {
  return users.some(
    (user) => user.username === username && user.password === password
  );
};

regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  if (authenticatedUser(username, password)) {
    const accessToken = jwt.sign({ data: password }, secretKey, {
      expiresIn: "1h",
    });

    req.session.authorization = {
      accessToken,
      username,
    };

    return res.status(200).json({ message: "User successfully logged in" });
  } else {
    return res
      .status(404)
      .json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
