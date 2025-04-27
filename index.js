const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = 3000;
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate'); // for template boilerplating

const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');

const listingRouter = require('./routes/listing.js');
const reviewRouter = require('./routes/review.js');
const userRouter = require('./routes/user.js');


const sessionOptions = {
    secret: "mysupersecretcode",
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

const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';

main().then(res=>console.log('database connected successfully')).catch(err=>console.log('some error occurred in database'))

async function main(){
    await mongoose.connect(MONGO_URL);
}

app.get('/',(req,res)=>{
    res.send('root is working...');
})

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// app.get('/demouser',async(req,res)=>{
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username: 'student',
//     })

//     let registeredUser =  await User.register(fakeUser,"helloworld");
//     console.log(registeredUser);
//     res.send(registeredUser);
// })

app.use((req,res,next)=>{
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currUser = req.user;
    next();
})

app.use('/listings',listingRouter);
app.use('/listings/:id/reviews',reviewRouter);
app.use('/',userRouter);

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
// npm i passport passport-local passport-local-mongoose