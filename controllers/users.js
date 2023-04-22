const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
//const async=require("async");
const nodemailer=require("nodemailer");
const crypto=require("crypto");

module.exports.renderRegister= (req, res) => {
    res.render("users/register")
}

module.exports.register= async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registerdUser = await User.register(user, password);
        req.login(registerdUser,error=>{ 
            if (error) return next(error);    
            req.flash("success", "welcome New User");
            res.redirect("/campgrounds")   
        })    
    } catch (e) {
        req.flash("error", e.message)
        res.redirect("/register");
    }
}

module.exports.renderLogin =(req,res)=>{
    res.render("users/login")    
}

module.exports.login= (req,res)=>{
    req.flash("success", "welcome Back");
    const redirectUrl=  req.session.returnTo || "/campgrounds" ;    
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout=(req, res) => {
    req.logout(catchAsync);
    req.flash("success", "Goodbye!");
    res.redirect("/campgrounds");
}

module.exports.renderForgot=(req,res)=>{
    res.render("users/forgot");
}



