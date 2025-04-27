const express = require("express");
const router = express.Router();
const multer = require("multer");
const listingController = require("../../controllers/listingController.js");
const listingModel = require("../../models/listingModel");
const ListingService = listingController.listingService;

const uploader = multer({
  storage: listingController.storage,
  fileFilter: listingController.imgFilter,
});

const JSON_TYPE = { Content_type: "application/json" };

router.use((req, res, next) => {
  res.set({
    "Content-type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,OPTIONS",
    "Access-Control-Allow-Headers":
      "Content-Type, Access-Control-Allow-Headers",
  });
  next();
});

// listings all
router.get("/", (req, res) => {
  ListingService.listings()
    .then((data) => {
      res.status(200);
      res.send(JSON.stringify(data));
    })
    .catch((err) => {
      console.error(err);
    });
});

// listing user
router.get("/listing/:id", (req, res) => {
  console.log(req.params.id);
  ListingService.listingDetails(req.params.id)
    .then((data) => {
      res.status(200);
      res.send(JSON.stringify(data));
    })
    .catch((err) => {
      console.error(err);
    });
});

// listing user
router.get("/:userid", (req, res) => {
  let username = req.params.userid;
  console.log(username);
  if (!username) {
    console.warn("No session user found — defaulting to 'TestUser'");
    username = "TestUser";
  }
  ListingService.userListings(username)
    .then((data) => {
      res.status(200);
      res.send(JSON.stringify(data));
    })
    .catch((err) => {
      console.error(err);
    });
});

// Create Listing
router.post("/", async (req, res, next) => {
  const newListing = {
    username: req.body.username,
    brand: req.body.brand,
    model: req.body.model,
    description: req.body.description,
    price: req.body.price,
    trades: req.body.trades === "on",
    filename: req.body.filename || "",
    mimetype: req.body.mimetype || "",
    imageurl: req.body.imageurl || "",
  };

  console.log(newListing);

  try {
    const dbListing = new listingModel(newListing);
    const listing = await ListingService.createListing(dbListing);

    res.status(201).json(listing); // Return the created listing
  } catch (err) {
    console.error("Error creating listing:", err);
    res
      .status(500)
      .json({ error: "Failed to create listing", details: err.message });
  }
});

/**
 * Updates listing in db and navigates back to user paged
 */
router.put("/:id", async (req, res, next) => {
  const updatedListing = {
    brand: req.body.brand,
    model: req.body.model,
    description: req.body.description,
    price: req.body.price,
    trades: req.body.trades === "on",
  };

  try {
    const listing = await ListingService.updateListing(
      req.params.id,
      updatedListing
    );
    res.status(200).json(listing);
  } catch (err) {
    console.error(err);
    res.status(400).end();
  }
});

router.delete("/:id", (req, res, next) => {
  ListingService.deleteListing(req.params.id)
    .then(() => {
      console.log("Deleted!");
    })
    .catch((err) => {
      console.log("Error deleting entry: ", err);
    });

  res.redirect("/users/" + req.session.user.name);
});

module.exports = router;
