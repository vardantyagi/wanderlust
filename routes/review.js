const express = require('express');
const router = express.Router({mergeParams:true});
const wrapAsync = require('../utils/wrapAsync.js');
const Listing = require('../models/listing');
const Review = require('../models/review.js');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware.js');
const reviewColtroller = require('../controllers/reviews.js');

// post route -> review

router.post('/' , validateReview ,  wrapAsync(reviewColtroller.createReview));

// delete review route

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, wrapAsync(reviewColtroller.destroyReview))

module.exports = router;