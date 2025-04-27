var express = require("express");
var router = express.Router();
const axios = require("axios");

const API_BASE_URL = "http://localhost:3030/api/listings";

router.get("/:userid", async (req, res) => {
  let username = req.session?.user?.name;

  if (!username) {
    console.error("User not found in session");
    return res.redirect("/login");
  }

  try {
    // Make a GET request to your own listings API
    const response = await axios.get(`${API_BASE_URL}/${username}`);

    const listings = response.data;

    res.render("user", {
      username: username,
      instruments: listings,
    });
  } catch (error) {
    console.error("Error fetching user listings:", error.message);
    res.status(500).send("Failed to load user listings");
  }
});

module.exports = router;
