const express = require("express");
const app = express();
const mongoose = require("mongoose");
const listing = require("./models/listing");
const data=require("./init")

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

app.get("/", (req, res) => {
  res.send("All fine");
});

app.get("/testListing", async (req, res) => {
  //inserting data into collection"Listing"
  let sampleListing = new listing({
    title: "My new villa",
    description: "By the beach",
    price: 1200,
    location: "Goa",
    country: "India",
  });
  await sampleListing.save();
  console.log("Sample was saved");
  res.send("Successfull testing");
  
});

app.listen(8080, (req, res) => {
  console.log("Listening");
});
