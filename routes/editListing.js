const express = require("express");
const router = express.Router();
const multer = require("multer");
const listingController = require("../controllers/listingController");
const flash = require("express-flash");
router.use(flash());
const axios = require("axios");

const API_BASE_URL = "http://localhost:3030/api/listings";

const uploader = multer({
  storage: listingController.storage,
  fileFilter: listingController.imgFilter,
});

/**
 * Gets edit listing page. If invalid data is present, will reload with red flash message
 */
router.get("/:id", async (req, res, next) => {
  console.log(req.params.id);
  try {
    const response = await axios.get(
      `${API_BASE_URL}/listing/${req.params.id}`
    );
    const data = response.data;

    if (!data) {
      return res.redirect("/users/" + req.session.user.name);
    }

    res.render("edit-listing", {
      instrument: data,
      flashMsg: req.flash("flashMsg"),
    });
  } catch (error) {
    console.error("Error fetching listing:", error.message);
    res.redirect("/users/" + req.session.user.name);
  }
});

/**
 * Updates listing in db and navigates back to user paged
 */
router.post("/:id", async (req, res, next) => {
  const updatedListing = {
    brand: req.body.brand,
    model: req.body.model,
    description: req.body.description,
    price: req.body.price,
    trades: req.body.trades === "on",
  };

  try {
    await axios.put(`${API_BASE_URL}/${req.params.id}`, updatedListing);
    console.log("Updated listing successfully!");
  } catch (error) {
    console.error("Error updating listing:", error.message);
    req.flash("flashMsg", "Database error updating listing");
    return res.redirect(`/editListing/${req.params.id}`);
  }

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
