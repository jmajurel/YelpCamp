var express = require("express");
var Campground = require("../models/campground");
var middleware = require("../middleware");

var router = express.Router();

//INDEX
router.get('/', function(req, res) {
  Campground.find(function(err, data) {
    if(err || !data) {
      console.log(err);
    } else {
      res.render('campgrounds/index', {campgrounds: data});
    }
  });
});

//CREATE
router.post('/', middleware.isLoggedIn, function(req, res) {

  var newCampground = new Campground({
    name: req.body.name,
    price: req.body.price,
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
      req.flash("error", "Something went wrong");
      console.log(err);
      res.redirect('/campgrounds');
    } else {
      res.redirect('/campgrounds');
    }
  });
});

//NEW
router.get('/new', middleware.isLoggedIn, (req, res) => {
  res.render('campgrounds/new');
});

//SHOW
router.get('/:id', (req, res) => {
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundItem){
    if(err || !foundItem) {
      console.log(err);
    } else {
      res.render('campgrounds/show', {campground: foundItem});
    }
  });
});

//EDIT
router.get('/:id/edit', middleware.isLoggedIn, middleware.checkCampOwnership, (req, res) => {
  Campground.findById(req.params.id, function(err, foundItem){
    if(err || !foundItem){
      console.log(err);
      res.redirect("back");
    } else {
      res.render('campgrounds/edit', {campground: foundItem}); 
    }
  });
});

//UPDATE
router.put('/:id', middleware.isLoggedIn, middleware.checkCampOwnership, (req, res) => {
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
router.delete('/:id', middleware.isLoggedIn, middleware.checkCampOwnership, (req, res) => {
  Campground.findByIdAndRemove(req.params.id, function(err){
    if(err) {
      console.log(err);
      res.redirect("/");
    } else {
      res.redirect("/");
    }
  });
});

module.exports = router;
