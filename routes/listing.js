const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");

const multer  = require('multer'); // for enctype="multipart/form-data" -> to handle and read files

const {storage} = require('../cloudConfig.js');

const upload = multer({ storage }); // dest: 'uploads/' for local machine

// index and create route
router
  .route('/')
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single('image'),
    validateListing,
    wrapAsync(listingController.createListing)
  );

  // new route

  router.get("/new", isLoggedIn, listingController.renderNewForm);

// show , update , and delete route

router
  .route('/:id')
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(
    isOwner,
    isLoggedIn,
    wrapAsync(listingController.destroyListing)
  );

// edit route

router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

module.exports = router;