## Wonderlust

Wonderlust is a full stack project with express, middlewarres and mongodb as database

## Update

Successfully made the routes for the listings of properties.

Successfully designed the basic route pages with help of bootstrap

## Client Side and Server Side Validation

Client side validation is done by bootstrap so that it remains same for all kind of browsers

Server side validation is done by (Joi) package to handle the unauthorized requests like from hoppscotch

used wrapAsync in place of trycatch block

used ExpressError class to throw the customized errors

## Review addition for individual listings

One to many relationship between the listing and reviews is set

adding review for the listings and deleting the reviews of any listing is done and, 

if a listing is deleted then the related reviews are also deleted using findOneAndDelete middleware 

One to many relationship between the listing and reviews is set

## Code modularity using Express.Router()

Express.Router() is used to make the code modular

separate folder and files are made for listing and reviews

## Fixes to be done

app.all('*',(req,res,next)=>{
    res.send("Hello");
    next(new ExpressError(404,"Page Not Found!"));
})

sending post request from hoppscotch to create new listing

## Added express-session and connect-flash

express session is inplemented to track the user's activity and information on the different routes in asession

connect-flash is used to flash some message in case of some failure or success to user and notify about the activity

## user authentication and authorization implemented using passport.js

user authentication is implemented using passport.js
by passport , passport-local , passport-local-mongoose

in authentication, user signup, login and logout are implemented seamlessly by passport.js and integrated with the routes like create new listing, update and delete route.

if the user is logged in then only he can create, update, and delete the listings.

if a user has createrd posted any review then only he can delete it and also if any listing is created by ony user then, only he can remove that listing.

## Implemented Upload Image feature using multer and cloudinary

Instead of adding image url, file from system upload is intregrated using multure and cloudinary as cloud storage

multer is used to parse the fil (multipart/form-data) data from form so that backend can read it.

Cloudinary is used as a cloud storage to store the listing image.

The url of the image is send from cloudinary (req.file.path) to be stored in mongoDB.

<!-- implemented full stack framework using MVC framework (to mension in resume) -->