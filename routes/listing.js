const express = require("express");
const router = express.Router();
const listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { ListingSchema } = require("../schema.js");

//Making function of validation using it as a middleware
//for listing (Server side)
const validateListing = (req, res, next) => {
  let { error } = ListingSchema.validate(req.body);
  if (error) {
    // console.log(error.details);
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

//Index route
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await listing.find({});
    res.render("listings/index.ejs", { allListings });
  })
);
// Create route
router.get("/new", (req, res) => {
  // res.send("Working")
  res.render("listings/new.ejs");
});

//show route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    // res.send("Working")
    let { id } = req.params;
    const data = await listing.findById(id).populate("reviews");
    // console.log(data)
    res.render("listings/show.ejs", { data });
  })
);

//Create route
router.post(
  "/",
  validateListing, //middleware of validation schema
  wrapAsync(async (req, res, next) => {
    //let {title,description,price,image,country,location}=req.body
    // let listing=req.body;
    // console.log(listing); ///this will return listing object
    // if (!req.body.listing) {
    //   throw new ExpressError(400, "Send Valid Data for Listings");
    // }
    const newListing = new listing(req.body.listing); // this will access that and will add that to database
    //req.body.listing is in the form of object "new lisiting({})"
    await newListing.save();
    req.flash("success", "New Listing Successfully Created!");
    return res.redirect("/listings");
  })
);

//Update Route

router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    // res.send("Working!")
    let { id } = req.params;
    const Listing = await listing.findById(id);
    res.render("listings/edit.ejs", { Listing });
  })
);

//Update Route
router.put(
  "/:id",
  validateListing, //Middleware for Validation Schema
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await listing.findByIdAndUpdate(id, { ...req.body.listing }); //deconstruct kr k individual parameter me convert kiya
    // const listing = req.body.listings;/
    if (!req.body.listing) {
      throw new ExpressError(400, "Send Valid Data for Listings");
    }
    req.flash("success", "Listing Updated Succesfully!");
    res.redirect(`/listings/${id}`);
  })
);

//Delete route
router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await listing.findByIdAndDelete(id);
    req.flash("success", "Listening Deleted!");
    res.redirect("/listings");
  })
);

module.exports = router;
