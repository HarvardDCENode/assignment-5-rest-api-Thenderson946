const express = require("express");
const router = express.Router();
const multer = require("multer");
const listingController = require("../controllers/listingController");
const flash = require("express-flash");
const listingModel = require("../models/listingModel");
router.use(flash());

const uploader = multer({
  storage: listingController.storage,
  fileFilter: listingController.imgFilter,
});

/**
 * Gets edit listing page. If invalid data is present, will reload with red flash message
 */
router.get("/:id", async (req, res, next) => {
  await listingModel
    .findOne({ _id: req.params.id })
    .then((data) => {
      if (data === null) {
        res.redirect("/users/" + req.session.user.name);
      }
      res.render("edit-listing", {
        instrument: data,
        flashMsg: req.flash("flashMsg"),
      });
    })
    .catch((err) => {
      res.redirect("/users/" + req.session.user.name);
    });
});

/**
 * Updates listing in db and navigates back to user paged
 */
router.post("/:id", async (req, res, next) => {
  let updatedListing = {
    brand: req.body.brand,
    model: req.body.model,
    description: req.body.description,
    price: req.body.price,
    trades: req.body.trades === "on",
  };

  // Find by passed id and update with partial listing
  await listingModel
    .findByIdAndUpdate(req.params.id, updatedListing)
    .then(() => {
      console.log("Updated!");
    })
    .catch((err) => {
      console.log("Error updating entry: ", err);
    });
  res.redirect("/users/" + req.session.user.name);
});

/**
 * Builds flash messaging
 */
router.use(function (err, req, res, next) {
  if (err.message == "updateListingErr") {
    req.flash("flashMsg", "Database error updating listing");
    res.redirect(`/editListing/${req.params.id}`);
  } else {
    next(err);
  }
});

module.exports = router;
