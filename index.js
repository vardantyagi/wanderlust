const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = 3000;
const Listing = require('./models/listing.js');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate'); // for template boilerplating
const wrapAsync = require('./utils/wrapAsync.js');
const ExpressError = require('./utils/ExpressError.js');
const listingScheme = require('./schema.js');

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,'/public')));
app.use(methodOverride('_method'));
app.set('view engine','ejs');
app.set('views',path.join(__dirname, 'views'));
app.engine('ejs', ejsMate);

const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';

main().then(res=>console.log('database connected successfully')).catch(err=>console.log('some error occurred in database'))

async function main(){
    await mongoose.connect(MONGO_URL);
}

app.get('/',(req,res)=>{
    res.send('root is working...');
})

// Schema Validation Middleware

const validateListing = (req,res,next)=>{
    console.log("line 35",req.body);
    
    let result = listingScheme.validate(req.body);
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

app.get('/listings', wrapAsync(async (req,res)=>{
    const allListings = await Listing.find({})
    res.render('listings/index.ejs',{allListings});
}))

// new route

app.get('/listings/new',(req,res)=>{
    res.render('listings/new.ejs');
})

// create route

app.post('/listings', validateListing, wrapAsync(async (req,res,next)=>{
    const {title,description,image,price,country,location} = req.body;
    console.log("line 64 body",req.body);
    
    const newListing = await Listing.insertOne({title,description,image,price,country,location});
    console.log(newListing);
    res.redirect('/listings');
}))

// show route

app.get('/listings/:id', wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render('listings/show.ejs',{listing});
}))

// edit route

app.get('/listings/:id/edit', wrapAsync(async (req,res)=>{
    let {id} = req.params;
    console.log(id);
    
    let listing = await Listing.findById(id);
    res.render('listings/edit.ejs',{listing});
}))

// update route

app.put('/listings/:id',validateListing, wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const {title,description,image,price,country,location} = req.body;
    const ListingToBeUpdated = {title,description,image,price,country,location};
    await Listing.findByIdAndUpdate(id,ListingToBeUpdated,{runValidators:true,new:true});
    res.redirect(`/listings/${id}`);
}))

// delete route

app.delete('/listings/:id', wrapAsync(async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect('/listings');
}))

// app.get('/testlisting',async(req,res)=>{
//     let sampleListing = new Listing({
//         title: "My New Villa",
//         description: "By the beach",
//         price: 1200,
//         location: "Calanguye, Goa",
//         country: "India"
//     })
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send('saved');
// })

// app.all('*',(req,res,next)=>{
//     // res.send("Hello");
//     next(new ExpressError(404,"Page Not Found!"));
// })

app.use((err,req,res,next)=>{
    let {statusCode=500,message="something went wrong"} = err;
    console.log(statusCode, message);
    res.status(statusCode).render('error.ejs',{err});
})


app.listen(port,()=>{
    console.log('server is listening to port ',port);  
})

// mongosh