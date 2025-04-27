const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

// index route

router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  })
);

// new route

router.get("/new", isLoggedIn, (req, res) => {
  res.render("listings/new.ejs");
});

// create route

router.post(
  "/",
  isLoggedIn,
  validateListing,
  wrapAsync(async (req, res, next) => {
    const { title, description, image, price, country, location } = req.body;
    console.log("line 64 body", req.body);

    const newListing = new Listing({
      title,
      description,
      image,
      price,
      country,
      location,
    });
    newListing.owner = req.user._id;
    await newListing.save();
    console.log(newListing);
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
  })
);

// show route

router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id)
      .populate({ path: "reviews", populate: { path: "author"},})
      .populate("owner"); // nested populate
    if (!listing) {
      console.log("listing not found");
      req.flash("error", "Listing you requested for does not exist!");
      res.redirect("/listings");
      return;
    }
    console.log(listing);
    console.log('reviews...........');
    console.log(listing.reviews);
    res.render("listings/show.ejs", { listing });
  })
);

// edit route

router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    console.log(id);

    let listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing you requested for does not exist!");
      res.redirect("/listings");
      return;
    }
    res.render("listings/edit.ejs", { listing });
  })
);

// update route

router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const { title, description, image, price, country, location } = req.body;
    const ListingToBeUpdated = {
      title,
      description,
      image,
      price,
      country,
      location,
    };
    await Listing.findByIdAndUpdate(id, ListingToBeUpdated, {
      runValidators: true,
      new: true,
    });
    req.flash("success", "Listing Updated Successfully!");
    res.redirect(`/listings/${id}`);
  })
);

// delete route

router.delete(
  "/:id",
  isOwner,
  isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted Successfully!");
    res.redirect("/listings");
  })
);

module.exports = router;