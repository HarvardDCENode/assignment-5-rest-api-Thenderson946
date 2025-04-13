const mongoose = require("mongoose");

//define user schema
const userSchema = mongoose.Schema({
  displayName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: false },
  password: { type: String, required: true },
  lastLogin: { type: Date },
  accountCreationDate: { type: Date },
  isAdmin: { type: Boolean, required: false },
});

module.exports = mongoose.model("user", userSchema);
