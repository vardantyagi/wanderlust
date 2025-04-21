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