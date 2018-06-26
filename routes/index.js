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

module.exports = router;
