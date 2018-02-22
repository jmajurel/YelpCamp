var express = require("express");
var User    = require("../models/user");
var Comment = require("../models/comment");
var Campground = require("../models/campground");

var router  = express.Router({mergeParams: true});

//SHOW ROUTE
router.get("/:id", function(req, res) {
  User.findById(req.params.id, function(err, usr) {
    if(err) {
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

module.exports = router;
