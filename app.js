var express        = require('express'),
    app            = express(),
    bodyParser     = require('body-parser'),
    mongoose       = require('mongoose'),
    passport       = require("passport"),
    localStrategy  = require("passport-local"),
    session        = require("express-session"),
    User           = require("./models/user"),
    Campground     = require("./models/campground"),
    Comment        = require("./models/comment"),
    seedDB         = require("./newseeds"),
    methodOverride = require('method-override'),
    flash          = require("connect-flash"),
    faker          = require("faker");

var campgroundRoutes = require("./routes/campgrounds"),
    commentRoutes    = require("./routes/comments"),
    indexRoutes      = require("./routes/index"),
    userRoutes       = require("./routes/users");

const port = process.env.PORT || 4000;
const databaseURL = process.env.DATABASEURL || "mongodb://localhost/yelpCamp";

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));

app.use(session(
  { 
    secret: "yelp",
    resave: false,
    saveUninitialized: false
  }
));
app.use(flash());
app.locals.moment = require("moment");

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  //res.locals.faker = faker;
  next();
});

mongoose.connect(databaseURL);

app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/users", userRoutes);
app.use(indexRoutes);

//seedDB();

app.listen(port , () => {
  console.log("Yelp Camp App is running on port " +port);
});
