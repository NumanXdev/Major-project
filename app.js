const express = require("express");
const app = express();
const mongoose = require("mongoose");
const listing = require("./models/listing");
const path = require("path"); //ejs
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

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

//Index route
app.get("/listings", async (req, res) => {
  const allListings = await listing.find({});
  res.render("listings/index.ejs", { allListings });
});
// Create route
app.get("/listings/new", (req, res) => {
  // res.send("Working")
  res.render("listings/new.ejs");
});

//show route
app.get("/listings/:id", async (req, res) => {
  // res.send("Working")
  let { id } = req.params;
  const data = await listing.findById(id);
  // console.log(data)
  res.render("listings/show.ejs", { data });
});

//Create route
app.post("/listings", async (req, res) => {
  //let {title,description,price,image,country,location}=req.body
  // let listing=req.body;
  // console.log(listing); ///this will return listing object

  const newListing = new listing(req.body.listing); // this will access that and will add that to database
  //req.body.listing is in the form of object "new lisiting({})"
  await newListing.save();
  res.redirect("/listings");
});

//Update Route

app.get("/listings/:id/edit", async (req, res) => {
  // res.send("Working!")
  let { id } = req.params;
  const Listing = await listing.findById(id);
  res.render("listings/edit.ejs", { Listing });
});

app.put("/listings/:id", async (req, res) => {
  let { id } = req.params;
  await listing.findByIdAndUpdate(id, { ...req.body.listing }); //deconstruct kr k individual parameter me convert kiya
  // const listing = req.body.listings;/
  res.redirect(`/listings/${id}`);
});

//Delete route
app.delete("/listings/:id", async (req, res) => {
  let { id } = req.params;
  await listing.findByIdAndDelete(id);
  res.redirect("/listings");
});

app.listen(8080, (req, res) => {
  console.log("Listening");
});
