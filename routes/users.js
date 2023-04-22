const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const passport = require("passport");
const users=require("../controllers/users")

router.get('/register',users.renderRegister);

router.post("/register", catchAsync(users.register));

router.get("/login",users.renderLogin)

router.post("/login",passport.authenticate("local",{failureFlash:true,failureRedirect:"/login"}),users.login)

router.get("/forgot",users.renderForgot)



// app.post("/forgot",async(req,res)=>{
//     const email=req.body.email; 
//     const user= await User.find({email: email})
//     console.log(user);

// })



//DEN KSERW GT ME AYTO DEN TREXEI
// router.get("/logout",(req,res,next)=>{
//     req.logout(function(error){
//         if(error){ return next(error);}
//         req.flash("success","You logged out");
//         res.redirect("/campgrounds")   
//     });  
// })
// I ENALAKTIKI APO PANO


router.get("/logout",users.logout);


module.exports = router;