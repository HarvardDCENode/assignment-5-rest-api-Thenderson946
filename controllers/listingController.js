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
      .find({ username: userId })
      .then((data) => {
        return data;
      })
      .catch((err) => {
        console.error(err);
      });
  }

  static listingDetails(id) {
    return listingModel
      .findOne({ _id: id })
      .then((data) => {
        return data;
      })
      .catch((err) => {
        console.error(err);
      });
  }

  static createListing(model) {
    return model
      .save()
      .then((data) => {
        return data;
      })
      .catch((err) => {
        console.error("Error saving listing to database:", err);
        throw new Error("Failed to save listing to database");
      });
  }

  static updateListing(id, updatedModel) {
    return listingModel
      .findByIdAndUpdate(id, updatedModel)
      .then((data) => {
        return data;
      })
      .catch((err) => {
        throw err;
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
