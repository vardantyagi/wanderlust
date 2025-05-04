if(process.env.NODE_ENV != 'production'){
    require('dotenv').config(); // to access .env file in backend
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = 3000;
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate'); // for template boilerplating

// const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';

const dbURL = process.env.ATLASDB_URL;

const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport'); // authentication and authorization
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');

const listingRouter = require('./routes/listing.js');
const reviewRouter = require('./routes/review.js');
const userRouter = require('./routes/user.js');

const store = MongoStore.create({
    mongoUrl: dbURL,
    crypto:{
        secret: process.env.SECRET,
    },
    touchAfter: 24*60*60,
});

store.on("error",(err)=>{
    console.log("ERROR in MONGO SESSION STORE", err);
})

const sessionOptions = {
    store: store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly: true,
    }
}

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname,'/public')));
app.use(methodOverride('_method'));
app.set('view engine','ejs');
app.set('views',path.join(__dirname, 'views'));
app.engine('ejs', ejsMate);


main().then(res=>console.log('database connected successfully')).catch(err=>console.log('some error occurred in database'))

async function main(){
    await mongoose.connect(dbURL).then(()=>'mongo atlas connected successfully');
}

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currUser = req.user;
    next();
})

app.use('/listings',listingRouter);
app.use('/listings/:id/reviews',reviewRouter);
app.use('/',userRouter);

app.use((err,req,res,next)=>{
    let {statusCode=500,message="something went wrong"} = err;
    res.status(statusCode).render('error.ejs',{err});
})

// app.all('*',(req,res,next)=>{
//     // res.send("Hello");
//     next(new ExpressError(404,"Page Not Found!"));
// })
  

app.listen(port,()=>{
    console.log('server is listening to port ',port);  
})

// mongosh
// npm i passport passport-local passport-local-mongoose
// npm i multer-storage-cloudinary cloudinary