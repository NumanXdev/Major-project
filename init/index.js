const mongoose = require("mongoose");
const intdata = require("./data.js");
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
  await Listing.insertMany(intdata.data);
  console.log("Data initialized");
};

initDB();
