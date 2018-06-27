const express = require('express');

const Book = require("../models/book-model.js");
const Author = require("../models/author-model.js");

const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get("/books", (req, res, next) => {
  Book.find()
    .populate("author")
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
    .populate("author")
    .then((bookDoc) => {
      res.locals.bookItem = bookDoc;
      res.render("book-details.hbs");
    })
    .catch((err) => {
      // show our error page
      next(err);
    });
});

// Place this route above "/book/:bookId" to avoid problems
router.get("/book/add", (req, res, next) => {
  res.render("book-form.hbs");
});

router.post("/process-book", (req, res, next) => {
  // get variables from the form submission (req.body for POST)
  const { title, author, description, rating } = req.body;

  // save submission variables into our new book
  Book.create({ title, author, description, rating })
    .then((bookDoc) => {
      // redirect ONLY to URLs ("/books" instead of "book-page.hbs")
      // (redirect to avoid duplicate data on refresh)
      res.redirect("/books");
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
    .populate("author")
    .then((bookDoc) => {
      res.locals.bookItem = bookDoc;
      res.render("book-details.hbs");
    })
    .catch((err) => {
      // show our error page
      next(err);
    });
});

router.get("/book/:bookId/edit", (req, res, next) => {
  // Get the ID from the URL
  // const bookId = req.params.bookId
  const { bookId } = req.params;

  // Book.findOne({ _id: bookId })
  Book.findById(bookId)
    .then((bookDoc) => {
      res.locals.bookItem = bookDoc;
      res.render("book-edit.hbs");
    })
    .catch((err) => {
      // show our error page
      next(err);
    });
});

router.post("/process-edit/:bookId", (req, res, next) => {
  // Get the ID from the URL
  // const bookId = req.params.bookId
  const { bookId } = req.params;

  // get variables from the form submission (req.body for POST)
  const { title, author, description, rating } = req.body;

  // Book.updateOne({ _id: bookId }, ...)
  Book.findByIdAndUpdate(
    bookId,
    { $set: { title, author, description, rating } },
    { runValidators: true }
  )
  .then((bookDoc) => {
    // redirect ONLY to URLs ("/books/9999" instead of "book-details.hbs")
    // (redirect to avoid duplicate data on refresh)
    res.redirect(`/book/${bookId}`);
  })
  .catch((err) => {
    // show our error page
    next(err);
  });
});

router.get("/book/:bookId/delete", (req, res, next) => {
  // Get the ID from the URL
  // const bookId = req.params.bookId
  const { bookId } = req.params;

  Book.findByIdAndRemove(bookId)
    .then((bookDoc) => {
      // redirect ONLY to URLs ("/books" instead of "book-page.hbs")
      res.redirect("/books");
    })
    .catch((err) => {
      // show our error page
      next(err);
    });
});

router.get("/author/:authorId", (req, res, next) => {
  const { authorId } = req.params;

  Author.findById(authorId)
    .then((authorDoc) => {
      res.locals.authorItem = authorDoc;
      res.render("author-details.hbs");
    })
    .catch((err) => {
      next(err);
    })
});

router.post("/book/:bookId/process-review", (req, res, next) => {
  const { bookId } = req.params;
  const { user, comments } = req.body;

  Book.findByIdAndUpdate(
    bookId,
    { $push: { reviews: { user, comments } } },
    { runValidators: true }
  )
  .then((bookDoc) => {
    res.redirect(`/book/${bookId}`)
  })
  .catch((err) => {
    next(err);
  });
});

module.exports = router;
