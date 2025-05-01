const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
  };

module.exports.createListing = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    console.log(url , "..", filename);
    
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
    newListing.image = {url,filename};
    await newListing.save();
    console.log(newListing);

    req.flash("success", "New Listing Created");
    res.redirect("/listings");
  }

module.exports.showListing = async (req, res) => {
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
  };

  module.exports.renderEditForm = async (req, res) => {
      let { id } = req.params;
      console.log(id);
  
      let listing = await Listing.findById(id);
      if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
        return;
      }
      res.render("listings/edit.ejs", { listing });
    };

module.exports.updateListing = async (req, res) => {
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
  }

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted Successfully!");
    res.redirect("/listings");
  }