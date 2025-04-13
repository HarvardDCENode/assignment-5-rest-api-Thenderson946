var express = require("express");
var router = express.Router();
const listingModel = require("../models/listingModel");

router.get("/:userid", async (req, res) => {
  if (!req.session.user || !req.session.user.name) {
    console.error("User not found in session");
    res.redirect("/login");
    return
  }

  let listings;
  await listingModel
    .find({ username: req.session.user.name })
    .then((data) => {
      listings = data;
    })
    .catch((err) => {
      console.error(err);
    });

  res.render("user", {
    username: req.params.userid,
    instruments: listings,
  });
});

module.exports = router;
