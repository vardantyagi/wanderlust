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

## Fixes to be done

app.all('*',(req,res,next)=>{
    res.send("Hello");
    next(new ExpressError(404,"Page Not Found!"));
})

sending post request from hoppscotch to create new listing