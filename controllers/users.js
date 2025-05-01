const User = require("../models/user");

module.exports.renderSignUpForm = (req,res)=>{
    res.render('users/signup.ejs');
};

module.exports.signup = async(req,res)=>{
    try {
        let {email,username,password} = req.body;
        const newUser =  new User({email,username});
        let registeredUser =  await User.register(newUser,password);
        console.log(registeredUser);
        // automatic login after signup
        req.login(registeredUser,(err)=>{
            if(err){
                next(err);
                return;
            }
            req.flash('success','Welcome to Wanderlust');
            res.redirect('/listings');
        })
    } catch (e) {
        req.flash('error',e.message);
        res.redirect('/signup');
    }
};

module.exports.renderLoginForm = (req,res)=>{
    res.render('users/login.ejs');
};

module.exports.login = async(req,res)=>{    
    req.flash('success','Welcome to Wanderlust, You are Logged In');
    let redirectUrl = res.locals.redirectUrl || '/listings';
    console.log(redirectUrl);
    res.redirect(redirectUrl);
}

module.exports.logout = (req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash('success','you are logged out');
        res.redirect('/listings');
    })
};