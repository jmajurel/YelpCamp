var Campground = require("../models/campground");
var Comment    = require("../models/comment");
var middlewarePackage = {};

//middleware
middlewarePackage.isLoggedIn = function(req, res, next){
  if(req.isAuthenticated()){
    next();
  } else {
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
  }
};

//Middleware for Authorization 
middlewarePackage.checkCampOwnership = function(req, res, next) {
  Campground.findById(req.params.id, function(err, foundItem){
    if(err || !foundItem){
      console.log(err);
      req.flash("error", "Cannot find Campground in the Database");
      res.redirect("back");
    } else {
      if(foundItem.author.id.equals(req.user._id) || req.user.isAdmin){
	next();
      } else {
        req.flash("error", "Permission denied");
	res.redirect("back");
      }
    }
  });
}

//Middleware for Authorization 
middlewarePackage.checkComOwnership = function(req, res, next) {
  Comment.findById(req.params.comment_id, function(err, foundItem){
    if(err || !foundItem){
      console.log(err);
      req.flash("error", "Cannot find Campground in the Database");
      res.redirect("back");
    } else {
      if(foundItem.author.id.equals(req.user._id) || req.user.isAdmin){
	next();
      } else {
        req.flash("error", "Permission denied");
	res.redirect("back");
      }
    }
  });
}

module.exports = middlewarePackage;
