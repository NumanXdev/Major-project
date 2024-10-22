const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");

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

const initDB = async () => {
  await Listing.deleteMany({});
  initdata.data = initdata.data.map((obj) => ({
    ...obj,
    owner: "6717e3f1a495ea459a78ddfe",
  }));
  await Listing.insertMany(initdata.data); //module export data:SampleListings

  console.log("Data initialized");
};

initDB();
