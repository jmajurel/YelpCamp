var mongoose              = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
  username: { type: String, unique: true},
  password: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  email: { type: String, unique: true },
  firstName: { type: String, default: ""},
  lastName: { type: String, default: ""},
  avatar: { type: String, default: "https://image.flaticon.com/icons/svg/138/138662.svg" },
  isAdmin: { type: Boolean, default: false }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
