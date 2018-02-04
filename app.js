var express       = require('express'),
    app           = express(),
    bodyParser    = require('body-parser'),
    mongoose      = require('mongoose'),
    passport      = require("passport"),
    localStrategy = require("passport-local"),
    session       = require("express-session"),
    User          = require("./models/user"),
    Campground    = require("./models/campground"),
    Comment       = require("./models/comment"),
    seedDB        = require("./newseeds")

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(session(
  { 
    secret: "yelp",
    resave: false,
    saveUninitialized: false
  }
));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  next();
});

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
app.post('/campgrounds/:id/comments', isLoggedIn, (req, res) => {

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

//NEW COMMENT
app.get('/campgrounds/:id/comments/new', isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, function(err, camp){
    if(err){
      console.log(err);
    } else {
      res.render('comments/new', {campground: camp});
    }
  });
});

app.get("/register", function(req, res) {
  res.render("register");
});

app.post("/register", function(req, res) {
  var newUser = { username: req.body.username };
  User.register(newUser, req.body.password, function(err, user){
    if(err) {
      console.log(err);
      res.redirect("/register");
    } else {
      passport.authenticate('local')(req, res, function(){
        res.redirect("/campgrounds");
      });
    }
  });  
});

app.get("/login", function(req, res) {
  res.render("login");
});

app.post("/login", passport.authenticate('local', { 
    successRedirect: '/', 
    failureRedirect: '/login'
 }));

app.get("/logout", function(req, res){
  req.logout();
  res.redirect("/");
});

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    next();
  } else {
    res.redirect("/login");
  }
};

app.listen(3000, () => {
  console.log("Yelp Camp App is running on port 3000");
});
