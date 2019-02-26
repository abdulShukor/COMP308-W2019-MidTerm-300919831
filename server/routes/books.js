/*Name: Abdul Shukor 
StudentID: 300919831
MidTerm Test COMP308
Date:2019-02-23 */

// modules required for routing
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

// define the book model
let book = require('../models/books');

/* GET books List page. READ */
router.get('/', (req, res, next) => {
  // find all books in the books collection
  book.find( (err, books) => {
    if (err) {
    // The Server error. 
      return console.error(err);
    }
    else {
      res.render('books/index', {
        title: 'Books',
        books: books,
        displayName: req.user ? req.user.displayName : ""
      });
    }
  });

});

//  GET the Book Details page in order to add a new Book
router.get('/add', (req, res, next) => {
    
  book.find((err, books) => {
    if (err) {
    // The Server will give you error massage if the application get crash. 
      return console.error(err);
    }
    else {
      res.render('books/details', {
        title: 'Add a new book',
        books: books,
        displayName: req.user ? req.user.displayName : ""
      });
    }
  });
});

// POST process the Book Details page and create a new Book - CREATE
router.post('/add', (req, res, next) => {

  let newContact = book({
      "Title": req.body.title,
      "Price": req.body.price,
      "Author": req.body.author,
      "Genre": req.body.genre

  });

  book.create(newContact, (err, book) => {
        // Server will give you error massage if the application get crash. 
      if(err) {
          console.log(err);
          res.end(err);
      }
      else {
          // refresh the book list
          res.redirect('/books');
      }
  });
});



/// GET the Book Details page in order to edit an existing Book
router.get("/:id", (req, res, next) => {
  let id = req.params.id;

  book.findById(id, (err, bookObject) => {
    if (err) {
      // The Server will give you error massage if the application get crash. 
      console.log(err);
      res.end(err);
    } else {
      res.render("books/details", {
        title: "Edit Book",
        books: bookObject,
        displayName: req.user ? req.user.displayName : ""
      });
    }
  });
});

// POST - process the information passed from the details form and update the document
router.post("/:id", (req, res, next) => {
  let id = req.params.id;

  let updatedBook = book({
    "_id": id,
    "Title": req.body.title,
    "Price": req.body.price,
    "Author": req.body.author,
    "Genre": req.body.genre
  });

  book.update({ _id: id }, updatedBook, (err) => {
    if (err) {
   // The Server will give you error massage if the application get crash. 
      console.log(err);
      res.end(err);
    } else {
   // refresh the book list
      res.redirect("/books");
    }
  });
});
// GET - process the delete by user id
router.get('/delete/:id',  (req, res, next) => {
  
  let id = req.params.id;

  book.remove({_id: id}, (err) => {
    // The Server will give you error massage if the application get crash. 
      if(err) {
          console.log(err);
          res.end(err);
      }
      else {
          // refresh the book list
          res.redirect('/books');
      }
  });
});

module.exports = router;
