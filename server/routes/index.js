// modules required for routing
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let passport = require("passport");

// define the book model
let book = require('../models/books');
let user = require('../models/users');

let User = user.User; 


/* GET home page. wildcard */
router.get('/', (req, res, next) => {
  res.render('content/index', {
    title: 'Home',
    books: '',
    displayName: req.user ? req.user.displayName : ""
   });
});


/* GET - displays the Login Page */
router.get('/login', (req, res, next) => {
  //check if the user is already exist
  if (!req.user) {
    res.render("auth/login", {
      title: "Login",
      messages: req.flash("loginMessage"),
      displayName: req.user ? req.user.displayName : ""
    });
  } else {
    return res.redirect("/");
  }
});

/* POST - processes the Login Page */
router.post('/login', (req, res, next) => {
  passport.authenticate('local', 
  (err, user, info) => {
    // server error?
    if(err) {
      return next(err);
    }
    if(!user) {
      req.flash("loginMessage", "Authentication Error");
      return res.redirect('/login');
    }
    req.logIn(user, (err) => {
      // server error?
      if(err) {
        return next(err);
      }
      return res.redirect('/books');
    });
  })(req, res, next);
});

/* GET - displays the User Registration Page */
router.get('/register', (req, res, next) => {
  if (!req.user) {
    res.render("auth/register", {
      title: "Register",
      messages: req.flash("registerMessage"),
      displayName: req.user ? req.user.displayName : ""
    });
  } else {
    return res.redirect("/");
  }
});

/* POST - processes the User Registration Page */
router.post('/register', (req, res, next) => {

  let newUser = new User({
    username: req.body.username,
    email: req.body.email,
    displayName: req.body.displayName
  });

  // regsiter the user and ckeck if user is already created 
  User.register(newUser, req.body.password, (err) => {
    if (err) {
      console.log("Error: Creating New User");
      if (err.name == "UserExistsError") {
        req.flash(
          "registerMessage",
          "Registration Error: User Already Exists"
        );
        
        console.log("Error: User Already Exists");
      }
      return res.render("auth/register", {
        title: "Register",
        messages: req.flash("registerMessage"),
        displayName: req.user ? req.user.displayName : ""
      });
    } else {
      // redirect the user to the books page 
      return passport.authenticate("local")(req, res, () => {
        res.redirect("/books");
      });
    }
  });
});

/* GET - perform the user logout the book list*/
router.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
