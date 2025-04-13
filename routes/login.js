const express = require("express");
const router = express.Router();
const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const flash = require("express-flash");
router.use(flash());

/**
 * Gets login page
 */
router.get("/", (req, res, next) => {
  res.render("login", {
    flashMsg: req.flash("flashMsg"),
  });
});

/**
 * Submits login form
 */
router.post("/", (req, res, next) => {
  const username = req.body.username;
  userModel
    .findOne({ username: username })
    .then(async (data) => {
      if (data.displayName === username) {
        // User was found, we need to verify password matches.
        await bcrypt.compare(
          req.body.password,
          data.password,
          (err, result) => {
            if (result) {
              // Valid password, we can log the user in and update the session
              data.lastLogin = Date.now();
              data
                .save()
                .then((resp) => {
                  // We saved successfully, set the session and redirect to user's page
                  req.session.user = { name: resp.username };
                  res.redirect(`/users/${resp.username}`);
                })
                .catch((err) => {
                  console.log(err);
                  if (err) {
                    next(Error("invalidLoginError", dbListing));
                  }
                });
            }
          }
        );
      } else {
        throw new Error();
      }
    })
    .catch((err) => {
      next(Error("invalidLoginError", err));
    });
});

/**
 * Logs out and destroys session
 */
router.get("/logout", (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

/**
 * Gets create account page
 */
router.get("/create", (req, res, next) => {
  res.render("create-account", {
    flashMsg: req.flash("flashMsg"),
  });
});

/**
 * Submits create account
 */
router.post("/create", (req, res, next) => {
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (!err) {
      let newUser = {
        username: req.body.username,
        displayName: req.body.displayName,
        email: req.body.email,
        accountCreationDate: Date.now(),
        password: hash,
      };

      const dbListing = new userModel(newUser);
      try {
        dbListing
          .save()
          .then((resp) => {
            // We saved successfully, set the session and redirect to user's page
            req.session.user = { name: resp.username };
            res.redirect(`/users/${newUser.username}`);
          })
          .catch((err) => {
            console.log(err);
            if (err) {
              next(Error("errorSavingUser", dbListing));
            }
          });
      } catch (err) {
        console.log("Error creating user: " + err);
        next(Error("errorSavingUser", dbListing));
      }
    }
  });
});

router.use(function (err, req, res, next) {
  if (err.message == "errorSavingUser") {
    req.flash(
      "flashMsg",
      "Error saving user, please check configuration and try again."
    );
    res.redirect("/login");
  } else if (err.message == "invalidLoginError") {
    console.log("error:" + err);
    req.flash(
      "flashMsg",
      "Error logging in, please check username and password"
    );
    res.redirect("/login");
  } else {
    next(err);
  }
});

module.exports = router;
