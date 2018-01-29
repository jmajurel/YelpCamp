var express     = require('express'),
    app         = express(),
    bodyParser  = require('body-parser'),
    mongoose    = require('mongoose'),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment"),
    seedDB      = require("./newseeds")

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect('mongodb://localhost/yelpCamp');

seedDB();

app.get('/', (req, res) => {
  res.render('home');
});

//INDEX
app.get('/campgrounds', function(req, res) {
  Campground.find(function(err, data) {
    if(err) {
      console.log(err);
    } else {
      res.render('campgrounds/index', {campgrounds: data});
    }
  });
});

app.post('/campgrounds', function(req, res) {

  var newCampground = new Campground({
    name: req.body.name,
    image: req.body.image,
    desc: req.body.description
  });

  newCampground.save(function(err) {
    if(err) {
      console.log(err);
    } else {
      res.redirect('/campgrounds');
    }
  });
});

//CREATE
app.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new');
});

//SHOW
app.get('/campgrounds/:id', (req, res) => {
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundItem){
    if(err) {
      console.log(err);
    } else {
      res.render('campgrounds/show', {campground: foundItem});
    }
  });
});

//INDEX COMMENT
app.post('/campgrounds/:id/comments', (req, res) => {
  Comment.create({
    content: req.body.content,
    author: req.body.author
  }, function(err){
    if(err) {
      console.log(err);
      res.redirect('/campgrounds/' + req.params.id);
    } else {
      res.redirect('/campgrounds/' + req.params.id); 
    }
  });
});

//NEW COMMENT
app.get('/campgrounds/:id/comments/new', (req, res) => {
  res.render('comments/new', {req: req});
});

app.listen(3000, () => {
  console.log("Yelp Camp App is running on port 3000");
});

