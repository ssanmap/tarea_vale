const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  const userExists = users.some(user => user.username === username);
  if (userExists) {
    return res.status(400).json({ message: "Username already exists" });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "User successfully registered" });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).json(books, null, 2);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn]; 
  
  if (book) {
      return res.status(200).json(book);
  } else {
      return res.status(404).json({message: "Libro no encontrado"});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  const booksByAuthor = [];

  Object.keys(books).forEach(bookId => {
    if (books[bookId].author === author) {
      booksByAuthor.push(books[bookId]);
    }
  });

  if (booksByAuthor.length > 0) {
    return res.status(200).json(booksByAuthor, null, 2);
  } else {
    return res.status(404).json({ message: "No books found for the author" });
  }
});

public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const booksByTitle = [];

  Object.keys(books).forEach(bookId => {
    if (books[bookId].title === title) {
      booksByTitle.push(books[bookId]);
    }
  });

  if (booksByTitle.length > 0) {
    return res.status(200).json(booksByTitle, null, 2);
  } else {
    return res.status(404).json({ message: "No books found with the given title" });
  }
});

public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews, null, 2);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
