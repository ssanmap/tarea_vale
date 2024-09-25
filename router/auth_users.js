const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
const userExists = users.some(user => user.username === username);
return !userExists;
}

const authenticatedUser = (username,password)=>{ 
const user = users.find(user => user.username === username && user.password === password);
return user !== undefined;
}

regd_users.post("/login", (req,res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (authenticatedUser(username, password)) {
    let token = jwt.sign({ username }, "fingerprint_customer", { expiresIn: '1h' });
    return res.status(200).json({ message: "Login successful", token });
  } else {
    return res.status(401).json({ message: "Invalid username or password" });
  }
});

regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;

  if (books[isbn]) {
    books[isbn].reviews = books[isbn].reviews || {};
    books[isbn].reviews.push(review);
    return res.status(200).json({ message: "Review added successfully" });
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
