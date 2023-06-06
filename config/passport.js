const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const CustomStrategy = require("passport-custom").Strategy;
const patron = require("../models/patron");
const ngo = require("../models/ngouser");

module.exports = function (passport) {
  passport.use(
    "local1",
    new CustomStrategy(function (req, done) {
      ngo
        .findOne({ email: req.body.email })
        .then((user) => {
          if (!user) {
            return done(
              null,
              false,
              req.flash("error", "Username does not exist")
            );
          }
          bcrypt.compare(
            req.body.password,
            user.password,
            function (err, isMatch) {
              if (err) throw err;

              if (isMatch) {
                user["type"] = "ngo";
                return done(null, user);
              } else {
                return done(
                  null,
                  false,
                  req.flash("error", "Incorrect username or password")
                );
              }
            }
          );
        })
        .catch((err) => console.log(err));
    })
  );

  passport.use(
    "local2",
    new CustomStrategy(function (req, done) {
      patron
        .findOne({ email: req.body.email })
        .lean()
        .then((user) => {
          if (!user) {
            return done(
              null,
              false,
              req.flash("error", "Username does not exist")
            );
          }
          bcrypt.compare(
            req.body.password,
            user.password,
            function (err, isMatch) {
              if (err) throw err;

              if (isMatch) {
                user["type"] = "patron";
                return done(null, user);
              } else {
                return done(
                  null,
                  false,
                  req.flash("error", "Incorrect username or password")
                );
              }
            }
          );
        })
        .catch((err) => console.log(err));
    })
  );

  passport.serializeUser(function (user, done) {
    console.log("this is user");
    console.log(user);
    done(null, user._id + "," + user.type);
  });

  passport.deserializeUser(function (id, done) {
    usertype = id.split(",")[1];
    id = id.split(",")[0];
    if (usertype == "ngo") {
      ngo
        .findById(id)
        .lean()
        .exec(function (err, user) {
          user["usertype"] = "ngo";
          return done(err, user);
        });
    } else {
      patron
        .findById(id)
        .lean()
        .exec(function (err, user) {
          user["usertype"] = "patron";
          return done(err, user);
        });
    }
  });
};
