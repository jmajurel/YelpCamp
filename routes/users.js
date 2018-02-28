var express = require("express");
var passport = require("passport");
var User    = require("../models/user");
var Comment = require("../models/comment");
var Campground = require("../models/campground");
var middleware = require("../middleware");

var router  = express.Router({mergeParams: true});
const adminCode = process.env.YELPCAMP_ADMINCODE || "administrator";

//NEW ROUTE
router.get("/", function(req, res) {
  res.render("users/new", { page: "register" });
});

//CREATE ROUTE
router.post("/", function(req, res) {

  var newUser = {};
  newUser.username = req.body.username;
  newUser.email    = req.body.email;

  if(req.body.adminCode && adminCode === req.body.adminCode) {
    newUser.isAdmin = true;
  }

  User.register(newUser, req.body.password, function(err, user){
    if(err || !user) {
      console.log(err);
      req.flash("error", "Cannot create user account");
      res.redirect("back");
    } else {
      passport.authenticate('local')(req, res, function(){
        req.flash("success", "Welcome to YelpCamp " + user.username);
        res.redirect("/campgrounds");
      });
    }
  });  
});

//SHOW ROUTE
router.get("/:id", function(req, res) {

  User.findById(req.params.id, function(err, usr) {
    if(err || !usr) {
      req.flash("error", "cannot find this user");
      res.redirect("/campgrounds");
    } else {
      Campground.find().where('author.id').equals(usr._id).exec(function(err, foundCamps){
	if(err) {
	  req.flash("error", "something went wrong");
          res.redirect("/campgrounds");
	} else {
          res.render("users/show", { user: usr, ownedCamps: foundCamps });
	}
      });
    }
  });
});

//EDIT ROUTE
router.get("/:id/edit", middleware.checkuserprofileownership, function(req, res) {
  User.findById(req.params.id, function(err, foundUser){
    if(err || !foundUser) {
      req.flash("error", "cannot find this user");
      res.redirect("/campgrounds");
    } else {
      res.render("users/edit", { user: foundUser });
    }
  });
});

//UPDATE ROUTE
router.put("/:id", middleware.checkuserprofileownership, function(req, res) {

  User.findById(req.params.id, function(err, usr){
    if(err || !usr) {
      req.flash("error", "Something went wrong");
      res.redirect("/users/"+ req.params.id);
    } else {
      usr.firstName = req.body.firstName;
      usr.lastName = req.body.lastName;
      usr.email = req.body.email;
      if(req.body.avatar) {
        usr.avatar = req.body.avatar;
      }
      usr.save(function(err){
	if(err) {
          req.flash("error", "Something went wrong");
	} else {
          res.redirect("/users/"+ usr._id);
	}
      });
    }
  });
});

function deleteUserRefCamp(req, res, next) {

  Campground.find()
  .where('author.id')
  .equals(req.params.id)
  .updateMany({ author: {} })
  .exec(function(err){
    if(err) {
      req.flash("error", "Something went wrong");
      res.redirect("/");
    } else {
      console.log("removed references to this author in the campgrounds");
      next();
    }
  });
}

function deleteUserRefCom(req, res, next) {

  Comment.find()
  .where('author.id')
  .equals(req.params.id)
  .updateMany({ author: {} })
  .exec(function(err){
    if(err) {
      req.flash("error", "Something went wrong");
      res.redirect("/");
    } else {
      console.log("removed references to this author in the campgrounds");
      next();
    }
  });
}

//DESTROY ROUTE
router.delete("/:id", 
    middleware.checkuserprofileownership, 
    deleteUserRefCamp, 
    deleteUserRefCom,
    function(req, res) {
      req.logout();
      User.findByIdAndRemove(req.params.id, function(err) {
	if(err) {
	  req.flash("error", "Cannot delete this useraccount");
          res.redirect("/")
	} else {
	  req.flash("success", "User account has been successfully deleted");
          res.redirect("/")
	}
      });
});


module.exports = router;
