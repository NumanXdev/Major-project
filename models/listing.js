const mongoose = require("mongoose");
const review = require("./review");
//mongoose.Schema-> stored into variable Schema so that while creating schema we dont need to write as mongoose.Schema
const Schema = mongoose.Schema;

const ListingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    type: String,
    default:
      " https://images.pexels.com/photos/4428293/pexels-photo-4428293.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1https://images.pexels.com/photos/4428293/pexels-photo-4428293.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",

    //image ha lekin link empty
    set: (v) =>
      v === ""
        ? " https://images.pexels.com/photos/4428293/pexels-photo-4428293.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1https://images.pexels.com/photos/4428293/pexels-photo-4428293.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
        : v,
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

ListingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", ListingSchema); //listings in DB
module.exports = Listing;
