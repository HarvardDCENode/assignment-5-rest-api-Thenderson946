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
router.get("/:userid", (req, res) => {
  let username = req.session?.user?.name;
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
router.post("/", uploader.single("image"), async (req, res, next) => {
  const path = "/static/img/" + (req.file ? req.file.filename : "");
  let newListing = {
    username: username ? usename : "N/A",
    brand: reqreq.body.brand,
    model: req.body.model,
    description: req.body.description,
    price: req.body.price,
    trades: req.body.trades === "on",
    filename: req.file ? req.file.filename : "N/A",
    mimetype: req.file ? req.file.mimetype : "N/A",
    imageurl: path,
  };
  const dbListing = new listingModel(newListing);

  try {
    const listing = await PhotoService.create(dbListing);
    res.status(201);
    res.send(JSON.stringify(listing));
  } catch (err) {
    res.status(404);
    res.end();
  }
});

/**
 * Updates listing in db and navigates back to user paged
 */
router.put("/:id", (req, res, next) => {
  let updatedListing = {
    brand: req.body.brand,
    model: req.body.model,
    description: req.body.description,
    price: req.body.price,
    trades: req.body.trades === "on",
  };

  // Find by passed id and update with partial listing
  ListingService.updateListing(req.params.id, updatedListing);
  res.redirect("/users/" + req.session.user.name);
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
