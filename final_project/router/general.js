const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res
      .status(400)
      .json({ message: "username and password are required" });

  if (isValid(username))
    return res.status(400).json({ message: "Username already exists" });

  users.push({ username, password });
  return res.status(200).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get("/", async (req, res) => {
  try {
    return res.status(200).json(books);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error retrieving books", error: error.message });
  }
});

// refactored
// public_users.get("/", (req, res) => {
//   let bookList = new Promise((resolve, reject) => {
//     try {
//       resolve(books);
//     } catch (error) {
//       reject(error);
//     }
//   });

//   return bookList
//     .then((books) => res.status(200).json(books))
//     .catch((error) =>
//       res
//         .status(500)
//         .json({ message: "Error retrieving books", error: error.message })
//     );
// });

// public_users.get("/", function (req, res) {
//   return res.status(200).json(books);
// });

// Get book details based on ISBN
public_users.get("/isbn/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  let foundBook = new Promise((resolve, reject) => {
    try {
      if (!books[isbn]) reject({ message: "Book not found", status: 404 });
      resolve(books[isbn]);
    } catch (error) {
      reject({ message: `server error: ${error}`, status: 500 });
    }
  });

  return foundBook
    .then((book) => res.status(200).json(book))
    .catch((err) => res.status(err.status).json({ message: err.message }));
});

// refactored
// public_users.get("/isbn/:isbn", (req, res) => {
//   const isbn = req.params.isbn;
//   if (!books[isbn]) {
//     return res.status(404).json({ message: "Book not found" });
//   }
//   return res.status(200).json(books[isbn]);
// });

// Get book details based on author
public_users.get("/author/:author", (req, res) => {
  const { author } = req.params;
  let foundBooks = new Promise((resolve, reject) => {
    try {
      const booksByAuthor = Object.values(books).filter((book) =>
        book.author.toLowerCase().includes(author.toLowerCase())
      );

      if (booksByAuthor.length > 0) resolve(booksByAuthor);
      else
        reject({
          message: "No books found by this author",
          status: 404,
        });
    } catch (error) {
      reject({ message: `server error: ${error}`, status: 500 });
    }
  });

  return foundBooks
    .then((books) => res.status(200).json(books))
    .catch((err) => res.status(err.status).json({ message: err.message }));
});

// refactored
// public_users.get("/author/:author", function (req, res) {
//   const { author } = req.params;

//   const booksByAuthor = Object.values(books).filter((book) =>
//     book.author.toLowerCase().includes(author.toLowerCase())
//   );

//   if (booksByAuthor.length > 0) return res.status(200).json(booksByAuthor);
//   else
//     return res.status(404).json({ message: "No books found by this author" });
// });

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const { title } = req.params;
  let foundBooks = new Promise((resolve, reject) => {
    try {
      const booksByTitle = Object.values(books).filter((book) =>
        book.title.toLowerCase().includes(title.toLowerCase())
      );

      if (booksByTitle.length > 0) resolve(booksByTitle);
      else reject({ message: "No books found by this title", status: 404 });
    } catch (error) {
      reject({ message: `server error: ${error}`, status: 500 });
    }
  });

  return foundBooks
    .then((books) => res.status(200).json(books))
    .catch((err) => res.status(err.status).json({ message: err.message }));
});

// refactored
// public_users.get("/title/:title", function (req, res) {
//   const { title } = req.params;

//   const booksByTitle = Object.values(books).filter((book) =>
//     book.title.toLowerCase().includes(title.toLowerCase())
//   );

//   if (booksByTitle.length > 0) return res.status(200).json(booksByTitle);
//   else return res.status(404).json({ message: "No books found by this title" });
// });

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const { isbn } = req.params;

  if (books[isbn]) {
    return res.status(200).json({ reviews: books[isbn].reviews });
  } else return res.status(404).json({ message: "Book not found" });
});

module.exports.general = public_users;
