const User = require("../models/user");
const keys = require("../config/keys");
const bcrypt = require("bcryptjs");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const JwtStrategy = require("passport-jwt").Strategy;
const { validationResult } = require("express-validator");
const { v4: uuidv4 } = require("uuid");
module.exports = function (passport) {
  /*JWT Strategy for authorization */
  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: keys.JWT.secret,
      },
      (payload, done) => {
        User.findById({ _id: payload._id }, (err, user) => {
          if (err) return done(err, false);
          if (user) return done(null, user);
          else return done(null, false);
        });
      }
    )
  );

  /* Local Register Strategy   */

  passport.use(
    "register",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "username",
        passReqToCallback: true,
        session: false,
      },
      function (req, email, username, done) {
        process.nextTick(() => {
          //Validation
          const errors = validationResult(req);
          if (!errors.isEmpty()) {
            const resStatusCode = 400;
            const fullError = { success: false, errors: errors.array() };
            const message = "Input validation error";
            return done(generateServerError(resStatusCode, fullError, message));
          }
          //check if username provided is unique
          User.findOne({ username }, (err, existingUser) => {
            if (err) {
              done(err);
            }

            if (existingUser) {
              return done(null, false, { message: "username taken" });
            }
            //check if username provided is unique
            User.findOne({ email }, (err, existingUser) => {
              if (err) {
                done(err);
              }

              if (existingUser) {
                return done(null, false, { message: "email taken" });
              }

              //create user

              const {
                firstname,
                lastname,
                username,
                password,
                email,
                confirmPassword,
              } = req.body;

              //check if password and password confirm match
              if (password !== confirmPassword) {
                return done(null, false, { message: "Passwords dont match" });
              }

			  const confirmKey = uuidv4();
              const newUser = User({
                firstname: firstname,
                lastname: lastname,
                username: username,
                password: bcrypt.hashSync(password, 10),
                email: email,
                confirmKey: confirmKey,
                forgotKey: "",
              });

              newUser.save((err, user) => {
                if (err) {
                  return done(err);
                }
                if (user) {
                  return done(null, user);
                }
              });
            });
          });
        });
      }
    )
  );

  /* Local Strategy to login */
  passport.use(
    new LocalStrategy((username, password, done) => {
      User.findOne({ username: username }, (err, user) => {
        //something went wrong with db
        if (err) {
          return done(err);
        }
        //user does not exist
        if (!user) {
          return done(null, false, {
            message: "Incorrect username or password.",
          });
        }
        //pasword is incorrect
        if (!user.validPassword(password)) {
          return done(null, false, {
            message: "Incorrect username or password.",
          });
        }
        //user email not confirmed
        if (!user.isMailConfirmed()) {
          return done(null, false, {
            message: "Please confirm your email address",
          });
        }
        return done(null, user);
      });
    })
  );

  /* Google Strategy */

  passport.use(
    new GoogleStrategy(
      {
        clientID: keys.GOOGLE.clientID,
        clientSecret: keys.GOOGLE.secret,
        callbackURL: "http://localhost:5000/oauth/google/redirect",
        passReqToCallback: true,
      },
      function (req, accessToken, refreshToken, profile, done) {
        process.nextTick(function () {
          if (!req.user) {
            User.findOne({ "google.id": profile.id }, function (err, user) {
              if (err) return done(err);
              if (user) {
                if (!user.google.token) {
                  user.google.token = accessToken;
                  user.google.name = profile.displayName;
                  user.google.email = profile.emails[0].value;
                  user.save(function (err) {
                    if (err) throw err;
                  });
                }
                return done(null, user);
              } else {
                var newUser = new User();
                newUser.google.id = profile.id;
                newUser.google.token = accessToken;
                newUser.google.name = profile.displayName;
                newUser.google.email = profile.emails[0].value;

                newUser.save(function (err) {
                  if (err) throw err;
                  return done(null, newUser);
                });
              }
            });
          } else {
            var user = req.user;
            user.google.id = profile.id;
            user.google.token = accessToken;
            user.google.name = profile.displayName;
            user.google.email = profile.emails[0].value;

            user.save(function (err) {
              if (err) throw err;
              return done(null, user);
            });
          }
        });
      }
    )
  );

  /* set session cookie */
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  /* takes session cookie and gets user */
  passport.deserializeUser((user, done) => {
    done(null, user);
  });
};
