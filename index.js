const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = 3000;
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate'); // for template boilerplating
const listings = require('./routes/listing.js')
const reviews = require('./routes/review.js')

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
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

app.use('/listings',listings);
app.use('/listings/:id/reviews',reviews);

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