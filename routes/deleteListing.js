const express = require("express");
const router = express.Router();
const listingModel = require("../models/listingModel");

/**
 * Deletes listing entry
 */
router.get("/:id", async (req,res,next)=>{
  await listingModel.findByIdAndDelete(req.params.id)
  .then(() =>{
    console.log("Deleted!");
  })
  .catch((err) => {
    console.log("Error deleting entry: ", err)
  })
  res.redirect("/users/" + req.session.user.name);
})


module.exports = router;
