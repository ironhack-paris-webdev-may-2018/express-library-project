const express = require('express');

const Book = require("../models/book-model.js");

const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get("/books", (req, res, next) => {
  Book.find()
    .then((bookResults) => {
      // send the database results to the view as "bookArray"
      res.locals.bookArray = bookResults;
      res.render("books-page.hbs");
    })
    .catch((err) => {
      // show our error page
      next(err);
    });
});

// To link here it's "/read?b=9999"
router.get("/read", (req, res, next) => {
  // Get the ID from the query string
  // const b = req.query.b;
  const { b } = req.query;

  // Book.findOne({ _id: b })
  Book.findById(b)
    .then((bookDoc) => {
      res.locals.bookItem = bookDoc;
      res.render("book-details.hbs");
    })
    .catch((err) => {
      // show our error page
      next(err);
    });
});

// To link here it's "/book/9999"
router.get("/book/:bookId", (req, res, next) => {
  // Get the ID from the URL
  // const bookId = req.params.bookId
  const { bookId } = req.params;

  // Book.findOne({ _id: bookId })
  Book.findById(bookId)
    .then((bookDoc) => {
      res.locals.bookItem = bookDoc;
      res.render("book-details.hbs");
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
