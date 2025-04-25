const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const Listing = require('../models/listing');
const {listingSchema} = require('../schema.js');
const ExpressError = require('../utils/ExpressError.js');
const {isLoggedIn} = require('../middleware.js');

const validateListing = (req,res,next)=>{
    console.log("line 35",req.body);
    
    let result = listingSchema.validate(req.body);
    const {error} = result;
    console.log("line 37 error,",error);
    console.log("line 38 result,",result);
    if(error){
        let errMsg = error.details.map((e)=>e.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

// index route

router.get('/', wrapAsync(async (req,res)=>{
    const allListings = await Listing.find({})
    res.render('listings/index.ejs',{allListings});
}))

// new route

router.get('/new',isLoggedIn,(req,res)=>{
    res.render('listings/new.ejs');
})

// create route

router.post('/', isLoggedIn, validateListing, wrapAsync(async (req,res,next)=>{
    const {title,description,image,price,country,location} = req.body;
    console.log("line 64 body",req.body);
    
    const newListing = await Listing.insertOne({title,description,image,price,country,location});
    console.log(newListing);
    req.flash('success','New Listing Created');
    res.redirect('/listings');
}))

// show route

router.get('/:id', wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id).populate("reviews");
    if(!listing){
        console.log('listing not found');
        req.flash('error','Listing you requested for does not exist!');
        res.redirect('/listings');
        return;
    }
    res.render('listings/show.ejs',{listing});
}))

// edit route

router.get('/:id/edit', isLoggedIn, wrapAsync(async (req,res)=>{
    let {id} = req.params;
    console.log(id);
    
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash('error','Listing you requested for does not exist!');
        res.redirect('/listings');
        return;
    }
    res.render('listings/edit.ejs',{listing});
}))

// update route

router.put('/:id', isLoggedIn, validateListing, wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const {title,description,image,price,country,location} = req.body;
    const ListingToBeUpdated = {title,description,image,price,country,location};
    await Listing.findByIdAndUpdate(id,ListingToBeUpdated,{runValidators:true,new:true});
    req.flash('success','Listing Updated Successfully!');
    res.redirect(`/listings/${id}`);
}))

// delete route

router.delete('/:id', isLoggedIn, wrapAsync(async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash('success','Listing Deleted Successfully!');
    res.redirect('/listings');
}))

module.exports = router;