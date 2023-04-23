const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
//const async=require("async");
const nodemailer=require("nodemailer");
const crypto=require("crypto");
const randomstring=require("randomstring");
const config=require("../config/config");

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

module.exports.forgot= async(req,res)=>{
    try{
        const email=req.body.email;  
        const user= await User.findOne({email:email});
        if(user){
            const randomString= randomstring.generate();  
            const updatedUser= await User.updateOne({email:email},{$set:{token:randomString}})                   
            const user= await User.findOne({email:email});
            console.log(user);
            sendResetPasswordMail(user.username,user.email,user.token)
            req.flash("success", "Please Check your email inbox!");
            res.redirect("/forgot"); 
        }else{
            req.flash("error", "This email doesn't exist!");
            res.redirect("/forgot");      
        }

    }catch(error){
       
    }

}


// //for Reset Password via Email
const sendResetPasswordMail= async(name,email,token)=>{
  
    try{
        const transporter=nodemailer.createTransport({
            host:"smtp.gmail.com",
            port: 587,   
            secure: false,
            requireTLS:true,
            auth:{
                user:config.emailUser,
                pass: config.emailPassword
            }
        
        });
 
        const mailOptions={
            from:config.emailUser,
            to:email,
            subject:"YelpCamp Reset Password !",
            // html:"<p> Hi "+name+ `! Please Click here to <a href="http://127.0.0.1:3000/forget-password?Token=${token}"> Reset</a> Password.`
            html:"<p> Hi "+name+ `! Please Click here to <a href="https://yelpcamp-p2m0.onrender.com/forget-password?Token=${token}"> Reset</a> Password.`

        }

        transporter.sendMail(mailOptions,function(error,info){
            if(error){
                console.log(error)
            }else{
               
                console.log("Email has been Sent- ",info.response);
            }

        })
    }catch(error){
        console.log(error.message)
    }

}

module.exports.forgetPasswordLoad= async(req,res)=>{
    try{   
    const token =req.query.Token;
    const tokenData= await User.findOne({token:token});
    console.log(tokenData);
   
    if(tokenData){
        res.render("users/forget-password",{user_id:tokenData._id})    
    }else{   
        req.flash("error", "Token is invalid or expired !");
        res.redirect("/login")  
    }

    }catch (error) {
        console.log(error.message)       
    }
}

module.exports.resetPassword=async(req,res)=>{
    try{
    const password=req.body.password;
    const user_id=req.body.user_id;
    const user= await User.findById({_id:user_id})
    await user.setPassword(password);
    await user.save();
    const updatedUser= await User.updateOne({_id:user_id},{$set:{token:""}}) // another way ? like user.setTeken="" 
    req.flash("success", "Password successfully !");    
    res.redirect("/login")
      
    }catch(error) {
        console.log(error);    
    }

}

