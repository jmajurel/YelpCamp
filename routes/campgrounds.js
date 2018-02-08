var express = require("express");
var Campground = require("../models/campground");
var router = express.Router();

//INDEX
router.get('/', function(req, res) {
  Campground.find(function(err, data) {
    if(err) {
      console.log(err);
    } else {
      res.render('campgrounds/index', {campgrounds: data});
    }
  });
});

//CREATE
router.post('/', isLoggedIn, function(req, res) {

  var newCampground = new Campground({
    name: req.body.name,
    image: req.body.image,
    desc: req.body.description
  });

  var CampgroundAuthor = {
    id: req.user._id,
    username: req.user.username
  };
  newCampground.author = CampgroundAuthor;

  newCampground.save(function(err) {
    if(err) {
      console.log(err);
    } else {
      res.redirect('/campgrounds');
    }
  });
});

//NEW
router.get('/new', isLoggedIn, (req, res) => {
  res.render('campgrounds/new');
});

//SHOW
router.get('/:id', (req, res) => {
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundItem){
    if(err) {
      console.log(err);
    } else {
      res.render('campgrounds/show', {campground: foundItem});
    }
  });
});

//EDIT
router.get('/:id/edit', isLoggedIn, checkOwnership, (req, res) => {
  Campground.findById(req.params.id, function(err, foundItem){
    if(err){
      console.log(err);
      res.redirect("back");
    } else {
      res.render('campgrounds/edit', {campground: foundItem}); 
    }
  });
});

//UPDATE
router.put('/:id', isLoggedIn, checkOwnership, (req, res) => {
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err) {
    if(err){
      console.log(err);
      res.redirect("back");
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

//DESTROY
router.delete('/:id', isLoggedIn, checkOwnership, (req, res) => {
  Campground.findByIdAndRemove(req.params.id, function(err){
    if(err) {
      console.log(err);
      res.redirect("/");
    } else {
      res.redirect("/");
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

//Middleware for Authorization 
function checkOwnership(req, res, next) {
  Campground.findById(req.params.id, function(err, foundItem){
    if(err){
      console.log(err);
      res.redirect("back");
    } else {
      if(foundItem.author.id.equals(req.user._id)){
	next();
      } else {
	res.redirect("back");
      }
    }
  });
}

module.exports = router;
