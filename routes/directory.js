var express = require("express");
var router = express.Router();
const listingModel = require("../models/listingModel");

/**
 * Routes directory towards main page.
 */
router.get("/", async (req, res, next) => {
    res.render("directory");
});

module.exports = router;
