const express = require("express");
const router = express.Router();
const listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../Middleware.js");

//Index route
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await listing.find({});
    res.render("listings/index.ejs", { allListings });
  })
);
// Create route
router.get("/new", isLoggedIn, (req, res) => {
  // res.send("Working")
  // console.log(req.user);
  //using middleware for isAuthenticated()
  // if (!req.isAuthenticated()) {
  //   req.flash("error", "Yoy must be logged in to create listings!");
  //   return res.redirect("/login");
  // }

  res.render("listings/new.ejs");
});

//show route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    // res.send("Working")
    let { id } = req.params;
    const data = await listing
      .findById(id)
      .populate({ path: "reviews", populate: { path: "author" } })
      .populate("owner");
    console.log(data);
    if (!data) {
      req.flash("error", "Listing you requested for doesn't exist");
      res.redirect("/listings");
    }
    res.render("listings/show.ejs", { data });
  })
);

//Create route
router.post(
  "/",
  isLoggedIn,
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
    newListing.owner = req.user._id;
    await newListing.save();
    // console.log(newListing.owner);
    req.flash("success", "New Listing Successfully Created!");
    return res.redirect("/listings");
  })
);

//Edit Route

router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    // res.send("Working!")
    let { id } = req.params;
    const Listing = await listing.findById(id);
    if (!Listing) {
      req.flash("error", "Listing you requested for doesn't exist");
      res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { Listing });
  })
);

//Update Route
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
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
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await listing.findByIdAndDelete(id);
    req.flash("success", "Listening Deleted!");
    res.redirect("/listings");
  })
);

module.exports = router;
