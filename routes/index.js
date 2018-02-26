var express = require("express");
var passport = require("passport");
var User    = require("../models/user");


var router  = express.Router();

//Root route
router.get('/', (req, res) => {
  res.render('landing');
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

//FORGOT PASSWORD
router.get("/forgot", function(req, res) {
  res.render("forgot");
});

//FORGOT PASSWORD
router.post("/forgot", function(req, res) {
  User.findOne({email: req.body.email}, function(err, usr) {
    if(err) {
      req.flash("error", "Cannot find this email address")
      res.redirect("back");
    } else {
      res.redirect("back");
    }
  });
});
module.exports = router;
