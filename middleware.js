const Listing = require("./models/listing");
const Review = require("./models/review");
const { listingSchema, reviewSchema } = require("./schema");
const ExpressError = require("./utils/ExpressError");

module.exports.isLoggedIn = (req,res,next)=>{
    
    // console.log(req.path," ",req.originalUrl);

    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash('error','You must be logged in to create listing!')
        res.redirect('/login');
        return;
    }
    next();
}

// passport bydefault resets the value of session so we will store the value of redirectUrl in res.locals
module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash('error',"You are not the owner of this listing");
        res.redirect(`/listings/${id}`)
        return;
    }
    next();
}

module.exports.validateListing = (req,res,next)=>{
    
    let result = listingSchema.validate(req.body);
    const {error} = result;
    
    if(error){
        let errMsg = error.details.map((e)=>e.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

// Schema Validation Middleware

module.exports.validateReview = (req,res,next)=>{
    
    let result = reviewSchema.validate(req.body);
    const {error} = result;
   
    if(error){
        let errMsg = error.details.map((e)=>e.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

module.exports.isReviewAuthor = async (req,res,next)=>{
    let {id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash('error','You are not the author of this review');
        res.redirect(`/listings/${id}`)
        return;
    }
    next();
}