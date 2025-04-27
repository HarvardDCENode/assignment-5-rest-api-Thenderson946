const express = require("express");
const router = express.Router();
const multer = require("multer");
const listingController = require("../controllers/listingController");
const flash = require("express-flash");
const axios = require("axios");
router.use(flash());
const formData = require("form-data");

const API_BASE_URL = "http://localhost:3030/api/listings";

const uploader = multer({
  storage: listingController.storage,
  fileFilter: listingController.imgFilter,
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
router.post("/", uploader.single("image"), async (req, res, next) => {
  const path = "/static/img/" + req.file.filename;

  // Create the new listing data
  const newListing = {
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

  try {
    const response = await axios.post(API_BASE_URL, newListing);

    if (response.status === 201) {
      res.redirect("/users/" + req.session.user.name);
    } else {
      throw new Error("Failed to create listing");
    }
  } catch (err) {
    console.error("Error creating listing:", err.message);
    req.flash(
      "flashMsg",
      "There was an error creating your listing. Please try again."
    );
    res.redirect("/createListing");
  }
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
