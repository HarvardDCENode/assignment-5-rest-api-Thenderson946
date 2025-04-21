const express = require("express");
const path = require("path");
const routes = require("./routes/routeExports");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const mongoose = require("mongoose");
const dbModels = require("./models/modelExports");
const apiListings = require("./routes/api/apiListings");

const userModel = dbModels.userModel;
require("dotenv").config();
const bcrypt = require("bcrypt");

const app = express();

app.use(cookieParser("cscie31-secret"));
app.use(
  session({
    secret: "cscie31",
    resave: "true",
    saveUninitialized: "true",
  })
);

mongoose
  .connect(process.env.DB_CONNECT_URI)
  .then(async (resp) => {
    // Determine if an admin account exists, and create one if not present
    userModel
      .exists({ username: "admin" })
      .then(async (data) => {
        if (!data) {
          bcrypt.hash(req.body.password, 10, async (err, hash) => {
            const adminUser = new userModel({
              displayName: "admin",
              username: "admin",
              password: "proxypass12345.",
              isAdmin: true,
            });
            try {
              const c = await adminUser.save();
              console.log("Admin account created!");
            } catch (err) {
              console.error(err);
            }
          });
        }
      })
      .catch((err) => {
        console.error("Error determining if an admin exists: " + err);
      });
  })
  .catch((err) => {
    console.error("Database connection error: " + err);
  });

// Middleware slot to populate pug global values. Maybe not the safest way?
app.use((req, res, next) => {
  res.locals.session = req.session || null;
  next();
});

app.use(bodyParser.urlencoded({ extended: false }));

// Set all Directory Listings
app.use("/", routes.directory);
app.use("/users", routes.users);
app.use("/browse", routes.browse);
app.use("/createListing", routes.createListing);
app.use("/deleteListing", routes.deleteListing);
app.use("/editListing", routes.editListing);
app.use("/login", routes.login);
app.use("/api/listings", apiListings);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(express.static("public"));

// Catch-all 404 handler
app.use((req, res) => {
  if (req.originalUrl.startsWith("/api/")) {
    res.status(404).json({ error: "API route not found" });
  } else {
    res.status(404).render("not-found");
  }
});

module.exports = app;
