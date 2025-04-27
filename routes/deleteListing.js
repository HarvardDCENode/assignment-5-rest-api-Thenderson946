const express = require("express");
const router = express.Router();
const axios = require("axios");

const API_BASE_URL = "http://localhost:3030/api/listings";

/**
 * Deletes listing entry
 */
router.get("/:id", async (req, res, next) => {
  try {
    await axios.delete(`${API_BASE_URL}/${req.params.id}`);
    console.log("Deleted listing successfully!");
  } catch (error) {
    console.error("Error deleting listing:", error.message);
  }

  res.redirect("/users/" + req.session.user.name);
});

module.exports = router;
