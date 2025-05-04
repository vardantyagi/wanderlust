const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview = async(req,res,next)=>{
    let {id} = req.params;
    
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
    req.flash('success','New Review Created!');
    res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReview = async(req,res)=>{
    let {id,reviewId} = req.params;
    
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}}); // $pull deletes the matched information from the Listing (matches review)
    await Review.findByIdAndDelete(reviewId);
    req.flash('success','Review Deleted!');
    res.redirect(`/listings/${id}/`);
};