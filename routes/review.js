const express = require('express');
const router = express.Router({mergeParams:true});
const wrapAsync = require('../utils/wrapAsync.js');
const Listing = require('../models/listing');
const Review = require('../models/review.js');
const {reviewSchema} = require('../schema.js');
const ExpressError = require('../utils/ExpressError.js');

// Schema Validation Middleware

const validateReview = (req,res,next)=>{
    console.log("line 51",req.body);
    
    let result = reviewSchema.validate(req.body);
    const {error} = result;
    console.log("line 55 error,",error);
    console.log("line 56 result,",result);
    if(error){
        let errMsg = error.details.map((e)=>e.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

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
        listing.reviews.push(newReview);
    
        await newReview.save();
        await listing.save();
        console.log("new review saved");
        res.redirect(`/listings/${listing._id}`);
    }
))

// delete review route

router.delete('/:reviewId',wrapAsync( async(req,res)=>{
    let {id,reviewId} = req.params;
    console.log(id,reviewId);
    
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}}); // $pull deletes the matched information from the Listing (matches review)
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}/`);
}))

module.exports = router;