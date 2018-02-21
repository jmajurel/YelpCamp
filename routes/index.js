var express = require("express");
var passport = require("passport");
var User    = require("../models/user");

var router  = express.Router();

//Root route
router.get('/', (req, res) => {
  res.render('landing');
});

//Sign-in route
router.get("/register", function(req, res) {
  res.render("register", { page: "register" });
});

//Sign-in route
router.post("/register", function(req, res) {
  var newUser = { username: req.body.username };
  if(req.body.adminCode === "administrator23011990") {
    newUser.isAdmin = true;
  }
  User.register(newUser, req.body.password, function(err, user){
    if(err || !user) {
      console.log(err);
      req.flash("error", err.message);
      res.redirect("back");
    } else {
      passport.authenticate('local')(req, res, function(){
        req.flash("success", "Welcome to YelpCamp " + user.username);
        res.redirect("/campgrounds");
      });
    }
  });  
});

//Login route
router.get("/login", function(req, res) {
  res.render("login", { page: "login" });
});

//Login route
router.post("/login", passport.authenticate('local', { failureRedirect: '/login'}), function(req, res){
  req.flash("success", "Hi " + req.user.username + " welcome back!");
  res.redirect("/campgrounds");
});

//logout route
router.get("/logout", function(req, res){
  req.logout();
  req.flash("success", "Successfully logout");
  res.redirect("/");
});

module.exports = router;
