var express    = require("express");
var passport   = require("passport");
var User       = require("../models/user");
var crypto     = require("crypto");
var async      = require("async");
var nodemailer = require("nodemailer");

var router  = express.Router();

//Root route
router.get('/', (req, res) => {
  res.render('landing');
});

//Login route
router.get("/login", function(req, res) {
  res.render("login", { page: "login" });
});

//Login route
router.post("/login", passport.authenticate('local', { failureRedirect: '/login'}), function(req, res){
  req.flash("success", "Hi " + req.user.username + " welcome back!");
  res.redirect("/campgrounds");
});

//logout route
router.get("/logout", function(req, res){
  req.logout();
  req.flash("success", "Successfully logout");
  res.redirect("/");
});

//FORGOT PASSWORD
router.get("/forgot", function(req, res) {
  res.render("forgot");
});

//FORGOT PASSWORD
router.post("/forgot", function(req, res) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ email: req.body.email }, function(err, usr) {
        if(err || !usr) {
          req.flash("error", "Cannot find this email address")
          res.redirect("back");
        } else {
          usr.resetPasswordToken = token;
          usr.resetPasswordExpires = Date.now() + 3600000;
          usr.save(function(err) {
            done(err, token, usr);
          });
        }
      });
    },
    function(token, usr, done) {

      // create reusable transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport({
        service: "Yahoo",
        auth: {
          user: 'yelpcamp.revolution@yahoo.com',
          pass: process.env.YELPCAMP_EMAILPWD
        }
      });

      // setup email 
      let mailOptions = {
        from: '"YelpCamp Admin" <yelpcamp.revolution@yahoo.com>',
        to: usr.email,
        subject: 'YelpCamp Revolution - Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };

      //send mail with defined transport object
      transporter.sendMail(mailOptions, (error, info) => {
        if(error) {
          console.log(error);
          req.flash("error", "Cannot send email to this address")
          res.redirect("back");
        } else {
          console.log('Message sent: %s', info.messageId);
          console.log('Previez URL: %s', nodemailer.getTestMessageUrl(info));
          req.flash("success", "An email has been sent to reset password to " + usr.email);
          res.redirect("/campgrounds");
        }
      });
    }
    ], function(err) {
      if(err) return next(err);
      res.redirect('back');
    });
});

router.get("/reset/:token", function(req, res) {
    User.findOne({ token :req.params.token, resetPasswordExpires: { $gt: Date.now() }}, function(err, usr){
      if(err) {
        req.flash("error", "Something went wrong");
        res.redirect("/campgrounds");
      } else {
        res.render("reset", { user: usr });
      }
    });
});

router.post("/reset/:token", function(req, res) {
  if(req.body.newPassword !== req.body.confirm) {
    req.flash("error", "New password doesn't match with the confirmation");
    res.redirect("back");
  } else {
    User.findOneAndUpdate({ token: req.params.token }, 
    { 
      password: req.body.newPassword,
      resetPasswordToken : undefined,
      resetPasswordExpires : undefined
    }, function(err, usr){
      if(err) {
        req.flash("error", "Something went wrong");
        res.redirect("back");
      } else {
        req.flash("success", "Password has been changed");
        res.redirect("/campgrounds"); 
      }
    });
  }
});

module.exports = router;
