const express = require("express");
const router = express.Router();
const multer = require("multer");
const photoController = require("../controllers/photoController");
const flash = require("express-flash");
const listingModel = require("../models/listingModel");
router.use(flash());

const uploader = multer({
  storage: photoController.storage,
  fileFilter: photoController.imgFilter,
});

/**
 * Gets create listing page. If invalid data is present, will reload with red flash message
 */
router.get("/", (req, res, next) => {
  res.render("create-listing", {
    flashMsg: req.flash("flashMsg"),
  });
});

/**
 * Creates listing in db and navigates back to user paged
 */
router.post("/", uploader.single("image"), (req, res, next) => {
  const path = "/img/" + req.file.filename;
  let newListing = {
    username: req.session.user.name,
    brand: req.body.brand,
    model: req.body.model,
    description: req.body.description,
    price: req.body.price,
    trades: req.body.trades === "on",
    filename: req.file.filename,
    mimetype: req.file.mimetype,
    imageurl: path,
  };
  const dbListing = new listingModel(newListing);

  dbListing
    .save()
    .then(() => {
      res.redirect("/users/" + req.session.user.name);
    })
    .catch((err) => {
      if (err) {
        console.log(err);
        next(Error("dbSaveError", err));
      }
    });
});


/**
 * Builds flash messaging
 */
router.use(function (err, req, res, next) {
  if (err.message == "OnlyImageFilesAllowed") {
    req.flash("flashMsg", "Please select an image file with jpg, png or gif");
    res.redirect("/createListing");
  } else if (err.message == "dbSaveError") {
    console.log("error:" + err);
    req.flash(
      "flashMsg",
      "Error saving file to db, please check configuration and try again"
    );
    res.redirect("/createListing");
  } else {
    next(err);
  }
});



module.exports = router;
