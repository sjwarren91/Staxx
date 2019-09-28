var bcrypt = require("bcryptjs");
var db = require("../models");

module.exports = function(passport) {
  var LocalStrategy = require("passport-local").Strategy;
  //signup
  passport.use(
    "local-signup",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true
      },

      function(req, email, password, done) {
        var generateHash = function(password) {
          return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
        };

        db.User.findOne({
          where: {
            email: email
          }
        }).then(function(user) {
          if (user) {
            return done(null, false, {
              message: "That email is already taken."
            });
          } else {
            var userPassword = generateHash(password);
            var data = {
              email: email,
              password: userPassword,
              firstname: req.body.firstname,
              lastname: req.body.lastname
            };

            db.User.create(data).then(function(newUser) {
              if (!newUser) {
                return done(null, false);
              }

              if (newUser) {
                return done(null, newUser);
              }
            });
          }
        });
      }
    )
  );

  //signin
  passport.use(
    "local-signin",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true
      },

      function(req, email, password, done) {
        var isValidPassword = function(userpass, password) {
          return bcrypt.compareSync(password, userpass);
        };

        db.User.findOne({
          where: {
            email: email
          }
        })
          .then(function(user) {
            if (!user) {
              return done(null, false, {
                message: "Email doesn't exist."
              });
            }

            if (!isValidPassword(user.password, password)) {
              return done(null, false, {
                message: "Incorrect password."
              });
            }

            var userinfo = user.get();
            return done(null, userinfo);
          })
          .catch(function(err) {
            console.log("Error: ", err);

            return done(null, false, {
              message: "Something went wrong with your Sign-in."
            });
          });
      }
    )
  );

  //serialize instance
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  //deserialze instance
  passport.deserializeUser(function(id, done) {
    db.User.findByPk(id).then(function(user) {
      if (user) {
        done(null, user.get());
      } else {
        done(user.errors, null);
      }
    });
  });
};
