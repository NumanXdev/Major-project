const express = require("express");
const app = express();
const mongoose = require("mongoose");
const listing = require("./models/listing");
const path = require("path"); //ejs
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate"); //When called anywhere inside a template, requests that the output of the current template be passed to the given view as the body local.
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const review = require("./models/review.js");
const { ListingSchema, reviewSchema } = require("./schema.js");
//we are exporting ListingSchema as a property of an object (module.exports.ListingSchema). This means that when you import it, you need to destructure it:

const MONGOOSE_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then((res) => {
    console.log("Connected Succesfully");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGOOSE_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

app.get("/", (req, res) => {
  res.send("All fine");
});

//TESTING

// app.get("/testListing", async (req, res) => {
//   //inserting data into collection"Listing"
//   let sampleListing = new listing({
//     title: "My new villa",
//     description: "By the beach",
//     price: 1200,
//     location: "Goa",
//     country: "India",
//   });
//   await sampleListing.save();
//   console.log("Sample was saved");
//   res.send("Successfull testing");

// });

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

//for Review serverside MW

const validateReview = (req, res, next) => {
  console.log(req.body);
  let { error } = reviewSchema.validate(req.body);

  if (error) {
    console.log(error.details);
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

//Index route
app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    const allListings = await listing.find({});
    res.render("listings/index.ejs", { allListings });
  })
);
// Create route
app.get("/listings/new", (req, res) => {
  // res.send("Working")
  res.render("listings/new.ejs");
});

//show route
app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    // res.send("Working")
    let { id } = req.params;
    const data = await listing.findById(id).populate("reviews");
    // console.log(data)
    res.render("listings/show.ejs", { data });
  })
);

//Create route
app.post(
  "/listings",
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
    return res.redirect("/listings");
  })
);

//Update Route

app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    // res.send("Working!")
    let { id } = req.params;
    const Listing = await listing.findById(id);
    res.render("listings/edit.ejs", { Listing });
  })
);

app.put(
  "/listings/:id",
  validateListing, //Middleware for Validation Schema
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await listing.findByIdAndUpdate(id, { ...req.body.listing }); //deconstruct kr k individual parameter me convert kiya
    // const listing = req.body.listings;/
    if (!req.body.listing) {
      throw new ExpressError(400, "Send Valid Data for Listings");
    }
    res.redirect(`/listings/${id}`);
  })
);

//Delete route
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await listing.findByIdAndDelete(id);
    res.redirect("/listings");
  })
);

//Reviews
//Post Review Route

app.post(
  "/listings/:id/reviews",
  validateReview,
  wrapAsync(async (req, res) => {
    // let {id}=req.params;
    let listings = await listing.findById(req.params.id);
    let newReview = new review(req.body.review);
    // console.log(newReview);

    listings.reviews.push(newReview);
    await newReview.save();
    await listings.save();

    console.log("New review saved");
    // res.send("Saved")
    res.redirect(`/listings/${listings._id}`); //or listings._id
  })
);

//Delete Review Route
app.delete(
  "/listings/:id/review/:reviewId",
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); //Using $pull to delete the objectId in review array
    await review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
  })
);

app.use("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
  console.log(err);
  let { status = 500, message = "Something Went Wrong!" } = err;
  //  res.status(status).send(message);
  res.status(status).render("error.ejs", { message });
});

app.listen(8080, (req, res) => {
  console.log("Listening");
});
