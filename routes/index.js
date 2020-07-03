var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");


// route route
router.get("/",function(req,res){
    res.render("landing");
});




//auth routes

//show register form
router.get("/register",function(req,res){
    res.render("register");
});
//handle signup logic
router.get("/register", (req, res) => res.render("register", {page: "register"}));

// handle sign up logic
router.post("/register", (req, res) => {
  let newUser = new User({
    username: req.body.username,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    avatar: req.body.avatar
  });
  
  if (req.body.adminCode === process.env.ADMINCODE) {
    newUser.isAdmin = true;
  }
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      if (err.name === 'MongoError' && err.code === 11000) {
        // Duplicate email
        req.flash("error", "That email has already been registered.");
        return res.redirect("/register");
      } 
      // Some other error
      req.flash("error", "Something went wrong...");
      return res.redirect("/register");
    }
    
    passport.authenticate("local")(req, res, () => {
      req.flash("success", "Welcome to YelpCamp " + user.username);
      res.redirect("/campgrounds");
    });
  });
});

//show login form
router.get("/login",function(req,res){
    res.render("login");
});


//handle login logic
router.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) { return next(err); }
      if (!user) {
        req.flash("error", "Invalid username or password");
        return res.redirect('/login');
      }
      req.logIn(user, err => {
        if (err) { return next(err); }
        let redirectTo = req.session.redirectTo ? req.session.redirectTo : '/campgrounds';
        delete req.session.redirectTo;
        req.flash("success", "Good to see you again, " + user.username);
        res.redirect(redirectTo);
      });
    })(req, res, next);
  });

//logout route
router.get("/logout",function(req,res){
    req.logOut();
    req.flash("success","Logged You Out!");
    res.redirect("/campgrounds");
});


module.exports = router;