const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken});

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
  };

module.exports.createListing = async (req, res, next) => {

    // let response = await geocodingClient.forwardGeocode({
    //   query: "New Delhi, India",
    //   limit: 1,
    // }).send();

    // console.log(response.body.features[0].geometry);
    // res.send('done!');

    let url = req.file.path;
    let filename = req.file.filename;
    
    const { title, description, image, price, country, location } = req.body;

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

    // newListing.geometry = response.body.features[0].geometry;

    let savedListing = await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
  }

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id)
      .populate({ path: "reviews", populate: { path: "author"},})
      .populate("owner"); // nested populate
    if (!listing) {
      req.flash("error", "Listing you requested for does not exist!");
      res.redirect("/listings");
      return;
    }
    res.render("listings/show.ejs", { listing });
  };

  module.exports.renderEditForm = async (req, res) => {
      let { id } = req.params;  
      let listing = await Listing.findById(id);
      if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
        return;
      }

      let originalImageURL = listing.image.url;
      originalImageURL = originalImageURL.replace('/upload','/upload/w_250'); // decrease pixel size for preview in edit form
      res.render("listings/edit.ejs", { listing , originalImageURL });
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
    let listing = await Listing.findByIdAndUpdate(id, ListingToBeUpdated, {
      runValidators: true,
      new: true,
    });

    if(typeof req.file !== 'undefined'){
      let url = req.file.path;
      let filename = req.file.filename;
      listing.image = {url,filename};
      await listing.save();
    }

    req.flash("success", "Listing Updated Successfully!");
    res.redirect(`/listings/${id}`);
  }

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted Successfully!");
    res.redirect("/listings");
  }

  // search listings by name

module.exports.searchListings = async (req,res) =>{
  let search = req.body.search;
  // let res = await Listing.find({`title : /${search}/i`})
  let searchedListings = await Listing.find({ title: new RegExp(search, 'i') });
  res.render("listings/search.ejs", { searchedListings });
}