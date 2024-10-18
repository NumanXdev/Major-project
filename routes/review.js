const express = require("express");
const router = express.Router({ mergeParams: true });
const listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const review = require("../models/review.js");
const { reviewSchema } = require("../schema.js");

//for Review serverside MW
const validateReview = (req, res, next) => {
  // console.log(req.body);
  let { error } = reviewSchema.validate(req.body);

  if (error) {
    console.log(error.details);
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

//Reviews
//Post Review Route

router.post(
  "/",
  validateReview,
  wrapAsync(async (req, res) => {
    // let {id}=req.params;
    // console.log(req.params.id)
    let listings = await listing.findById(req.params.id);
    let newReview = new review(req.body.review);
    // console.log(newReview);

    listings.reviews.push(newReview);
    await newReview.save();
    await listings.save();

    // console.log("New review saved");
    // res.send("Saved")
    req.flash("success", "New Review Created!");
    res.redirect(`/listings/${listings._id}`); //or listings._id
  })
);

//Delete Review Route
router.delete(
  "/:reviewId",
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); //Using $pull to delete the objectId in review array
    await review.findByIdAndDelete(reviewId);

    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;
