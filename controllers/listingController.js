var multer = require("multer");
const listingModel = require("../models/listingModel");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/img");
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const imgFilter = function (req, file, cb) {
  if (file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    cb(null, true);
  } else {
    cb(new Error("OnlyImageFilesAllowed"), false);
  }
};

class ListingService {
  static listings() {
    return listingModel
      .find({})
      .then((data) => {
        console.log(data);
        return data;
      })
      .catch((err) => {
        console.error(err);
      });
  }

  static userListings(userId) {
    return listingModel
      .findById(userId)
      .then((data) => {
        return data;
      })
      .catch((err) => {
        console.error(err);
      });
  }

  static createListing(model) {
    console.log("Here");
    return model
      .save()
      .then((data) => {
        res.status(200);
        res.set({ "Content-type": "application/json" });
        res.send(JSON.stringify(data));
      })
      .catch((err) => {
        if (err) {
          console.log(err);
          res.status(404);
          res.end();
        }
      });
  }

  static updateListing(id, updatedModel) {
    return listingModel
      .findByIdAndUpdate(req.params.id, updatedListing)
      .then((data) => {
        res.status(200);
        res.set({ "Content-type": "application/json" });
        res.send(JSON.stringify(data));
      })
      .catch((err) => {
        console.log(err);
        res.status(404);
        res.end();
      });
  }

  static deleteListing(id) {
    return listingModel
      .findByIdAndDelete(id)
      .then(() => {
        console.log("Deleted!");
      })
      .catch((err) => {
        console.log("Error deleting entry: ", err);
      });
  }
}

module.exports.storage = storage;
module.exports.imgFilter = imgFilter;
module.exports.listingService = ListingService;
