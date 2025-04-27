const express = require('express');
const router = express.Router({mergeParams:true});
const wrapAsync = require('../utils/wrapAsync.js');
const Listing = require('../models/listing');
const Review = require('../models/review.js');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware.js');

// post route -> review

router.post('/' , validateReview ,  wrapAsync(
    async(req,res,next)=>{
        
        let {id} = req.params;
        console.log(req.params);
        console.log(id);
        console.log(req.body);
        
        let listing = await Listing.findById(id);
        const {rating,comment} = req.body;
        const newReview = new Review({
            rating: rating,
            comment: comment,
        })
        newReview.author = req.user._id;
        listing.reviews.push(newReview);
    
        await newReview.save();
        await listing.save();
        console.log("new review saved");
        console.log(newReview);
        req.flash('success','New Review Created!');
        res.redirect(`/listings/${listing._id}`);
    }
))

// delete review route

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, wrapAsync( async(req,res)=>{
    let {id,reviewId} = req.params;
    console.log(id,reviewId);
    
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}}); // $pull deletes the matched information from the Listing (matches review)
    await Review.findByIdAndDelete(reviewId);
    req.flash('success','Review Deleted!');
    res.redirect(`/listings/${id}/`);
}))

module.exports = router;