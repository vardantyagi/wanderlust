const { ref } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review.js');

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    image: {
        url: 'String',
        filename: 'String',
    },
    // image: {
    //     type: String,

    //     default: "https://images.unsplash.com/photo-1575217550311-249515c168e0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",

    //     set: (v)=>(v) === ""? "https://images.unsplash.com/photo-1575217550311-249515c168e0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D": v,

    // },
    price: {
        type: Number,
        min: [0,"The pricing is too low"]
    },
    location: {
        type: String,
        required: true,
    },
    country: {
        type: String,
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    // geometry: {
    //     type: {
    //         type: String,
    //         enum: ['Point'],
    //         required: true,
    //     },
    //     coordinates: {
    //         type: [Number],
    //         required: true,
    //     }
    // }
});

// work as middleware when we delete the review, then its id from listing also gets deleted

listingSchema.post('findOneAndDelete',async(listing)=>{
    if(listing){
        await Review.deleteMany({_id: {$in: listing.reviews}});
    }
})

const Listing = mongoose.model('Listing',listingSchema);

module.exports = Listing;