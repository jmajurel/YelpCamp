var express = require("express");
var Comment = require("../models/comment");
var Campground = require("../models/campground");
var router  = express.Router({mergeParams: true});

//CREATE 
router.post('/', isLoggedIn, (req, res) => {

  Comment.create(req.body.comment, function(err, com){
    if(err) {
      console.log(err);
    } else {
      Campground.findById(req.params.id, function(err, camp){
        if(err){
	  console.log(err);
	} else {
	  camp.comments.push(com._id);
	  camp.save();
	  res.redirect('/campgrounds/' + camp._id); 
	}
      });
    }
  });
});

//NEW
router.get('/new', isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, function(err, camp){
    if(err){
      console.log(err);
    } else {
      res.render('comments/new', {campground: camp});
    }
  });
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
