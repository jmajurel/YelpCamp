var express = require("express");
var passport = require("passport");
var User    = require("../models/user");
var router  = express.Router();

//Root route
router.get('/', (req, res) => {
  res.render('home');
});

//Sign-in route
router.get("/register", function(req, res) {
  res.render("register");
});

//Sign-in route
router.post("/register", function(req, res) {
  var newUser = { username: req.body.username };
  User.register(newUser, req.body.password, function(err, user){
    if(err) {
      console.log(err);
      res.redirect("/register");
    } else {
      passport.authenticate('local')(req, res, function(){
        res.redirect("/campgrounds");
      });
    }
  });  
});

//Login route
router.get("/login", function(req, res) {
  res.render("login");
});

//Login route
router.post("/login", passport.authenticate('local', { 
    successRedirect: '/', 
    failureRedirect: '/login'
 }));

//logout route
router.get("/logout", function(req, res){
  req.logout();
  res.redirect("/");
});

//middleware
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    next();
  } else {
    res.redirect("/login");
  }
};

module.exports = router;
