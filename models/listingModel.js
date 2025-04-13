const mongoose = require("mongoose");

//create listing schema
const schema = mongoose.Schema({
  username: { type: String, required: true },
  brand: { type: String, required: true },
  model: { type: String, requried: true },
  description: { type: String, required: true },
  price: { type: Number },
  trades: { type: Boolean },
  filename: { type: String, required: true },
  mimetype: { type: String, required: true },
  imageurl: { type: String, required: true },
  createdAt: { type: Date },
  updatedAt: { type: Date },
});

schema.pre("save", function (next) {
  if (this.createdAt) {
    this.updatedAt = new Date();
  } else {
    this.createdAt = new Date();
  }
  next();
});

module.exports = mongoose.model("listing", schema);
