const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = 3000;
const Listing = require('./models/listing.js');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate'); // for template boilerplating

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

// index route

app.get('/listings', async (req,res)=>{
    const allListings = await Listing.find({})
    res.render('listings/index.ejs',{allListings});
})

// new route

app.get('/listings/new',(req,res)=>{
    res.render('listings/new.ejs');
})

// create route

app.post('/listings', async (req,res)=>{
    console.log("post req");    
    const {title,description,image,price,country,location} = req.body;
    const newListing = await Listing.insertOne({title,description,image,price,country,location});
    console.log(newListing);
    res.redirect('/listings');
})

// show route

app.get('/listings/:id', async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render('listings/show.ejs',{listing});
})

// edit route

app.get('/listings/:id/edit', async (req,res)=>{
    let {id} = req.params;
    console.log(id);
    
    let listing = await Listing.findById(id);
    res.render('listings/edit.ejs',{listing});
})

// update route

app.put('/listings/:id', async (req,res)=>{
    let {id} = req.params;
    const {title,description,image,price,country,location} = req.body;
    const ListingToBeUpdated = {title,description,image,price,country,location};
    await Listing.findByIdAndUpdate(id,ListingToBeUpdated,{runValidators:true,new:true});
    res.redirect(`/listings/${id}`);
})

app.delete('/listings/:id', async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect('/listings');
})

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

app.listen(port,()=>{
    console.log('server is listening to port ',port);  
})

// mongosh