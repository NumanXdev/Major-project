const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path"); //ejs
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate"); //When called anywhere inside a template, requests that the output of the current template be passed to the given view as the body local.
const ExpressError = require("./utils/ExpressError.js");
//we are exporting ListingSchema as a property of an object (module.exports.ListingSchema). This means that when you import it, you need to destructure it:
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/User.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

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

/*                                     --------------> TESTING <-------------
app.get("/testListing", async (req, res) => {
  inserting data into collection"Listing"
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
*/

//USING EXPRESS SESSIONS
sessionOption = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.get("/", (req, res) => {
  res.send("All fine");
});

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  // console.log(res.locals.success);
  next();
});

// app.get("/demoUser", async (req, res) => {
//   let fakeUser = new User({
//     email: "studdent@gmail.com",
//     username: "Dellta-Student",
//   });
//   let registeredUser = await User.register(fakeUser, "HelloWorld!");
//   res.send(registeredUser);
// });

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

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
