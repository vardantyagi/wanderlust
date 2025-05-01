const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview = async(req,res,next)=>{
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
};

module.exports.destroyReview = async(req,res)=>{
    let {id,reviewId} = req.params;
    console.log(id,reviewId);
    
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}}); // $pull deletes the matched information from the Listing (matches review)
    await Review.findByIdAndDelete(reviewId);
    req.flash('success','Review Deleted!');
    res.redirect(`/listings/${id}/`);
};