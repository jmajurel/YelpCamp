var express = require("express");
var Comment = require("../models/comment");
var Campground = require("../models/campground");
var middleware = require("../middleware");

var router  = express.Router({mergeParams: true});

//CREATE 
router.post('/', middleware.isLoggedIn, (req, res) => {

  Comment.create(req.body.comment, function(err, com){
    if(err || !com) {
      console.log(err);
    } else {
      Campground.findById(req.params.id, function(err, camp){
        if(err || !camp){
	  console.log(err);
	} else {
	  console.log(req.user);
	  com.author = {
	    id: req.user._id, 
	    username: req.user.username
	  };
	  com.save();
	  camp.comments.push(com._id);
	  camp.save();
	  res.redirect('/campgrounds/' + camp._id); 
	}
      });
    }
  });
});

//NEW
router.get('/new', middleware.isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, function(err, camp){
    if(err || !camp){
      console.log(err);
    } else {
      res.render('comments/new', {campground: camp});
    }
  });
});

//EDIT
router.get('/:comment_id/edit', middleware.isLoggedIn, middleware.checkComOwnership, function(req, res) {
  Comment.findById(req.params.comment_id, function(err, com) {
    if(err || !com){
      console.log(err);
      res.redirect("back");
    } else {
      res.render('comments/edit', {campground_id: req.params.id, comment: com});
    }
  });
});

//UPDATE
router.put('/:comment_id', middleware.isLoggedIn, middleware.checkComOwnership, function(req, res) {

  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, com){
    if(err){
      console.log(err);
      res.redirect("/campgrounds/" +req.params.id);
    } else {
      com.createdAt = new Date;
      com.save();
      res.redirect("/campgrounds/" +req.params.id);
    }
  });
});

//DESTROY
router.delete("/:comment_id", middleware.isLoggedIn, middleware.checkComOwnership, function(req, res) {
  Comment.findByIdAndRemove(req.params.comment_id, function(err){
    if(err) {
      console.log(err);
      res.redirect("/campgrounds/" + req.params.id);
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

module.exports = router;
