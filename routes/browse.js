var express = require("express");
var router = express.Router();

// Placeholder for pages not implemented
router.get(["/guitars", "/notGuitars"], (req, res, next) => {
  res.render("browse");
});

module.exports = router;
