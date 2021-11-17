var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;

var User = require("./models/user");

module.exports = function () {
  //turns a user object into an id
  passport.serializeUser(function (data, done) {
    //serializing the user
    done(null, data._id.toString());
  });
  //turns the id into a user object
  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, data) {
      done(err, data);
    });
  });

  passport.use(
    "signup",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      function (email, password, done) {
        User.findOne({ email: email }, function (err, data) {
          // console.log(data)
          if (err) {
            return done(err);
          }
          if (!data){
            console.log("no user")
            return done(null, false);
          }
          else if (password != data.password) {
            console.log("2");
            return done(null, false);
          } else if (password == data.password) {
            // console.log(data);
            return done(null, data);
          }
        });
      }
    )
  );
};
