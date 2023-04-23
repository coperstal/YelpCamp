// if(process.env.NODE_ENV !== "production"){
//     require('dotenv').config()
// console.log(process.env.SECRET) // remove this after you've confirmed it is working
// }
require('dotenv').config()

const express= require("express");
const path=require("path");
const mongoose = require('mongoose');
const ejsMate=require("ejs-mate");
const session = require("express-session");
const flash= require("connect-flash");
const ExpressError=require("./utils/ExpressError");
const methodOverride = require('method-override')
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User = require("./models/user");
//const helmet= require("helmet");
const rateLimit = require('express-rate-limit')
const MongoStore = require('connect-mongo');



const mongoSanitize = require('express-mongo-sanitize');

const usersRoutes=require("./routes/users");
const campgroundsRoutes = require("./routes/campgrounds");
const reviewsRoutes=require("./routes/reviews")


//const dbUrl="mongodb://localhost:27017/yelp-Camp";
const dbUrl=process.env.DB_URL || 'mongodb:localhost:27017/yelp-Camp';

mongoose.set('strictQuery', false);
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    //useCreateIndex: true,
    useUnifiedTopology: true
 
});

// const db=mongoose.connection;
// db.on("error",console.error.bind(console,"connection error:"));
// db.once("open",()=>{
//     console.log("Database Connected");
// });


const app= express();


// const limiter = rateLimit({
// 	windowMs: 100 * 60 * 1000, // 15 minutes
// 	max: 10, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
// 	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
// 	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
// })

// // Apply the rate limiting middleware to all requests
// app.use(limiter)



app.engine('ejs',ejsMate);
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(express.urlencoded( { extended:true} ) );//Gia na pairnw to Body
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,"public")));
app.use(mongoSanitize({   replaceWith: '_',})); // replace the $ signs to _to avoid NoSql Injections


const secret= process.env.SECRET || "Thisshouldbebettersecret";
//const secret= "Thisshouldbebettersecret";



const store =new MongoStore({
    mongoUrl: dbUrl,
    secret,
    touchAfter: 24*60*60
});

store.on("error",function(e){
    console.log("Session store error",e);
})

app.use(session({
    store,
    name:'session',
    secret,
    resave: true,
    saveUninitialized: true,
    cookies:{
        httpOnly: true,
        //secure:true, Only secure connections https
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7       
    }
}));

app.use(flash());


// app.use(helmet());
// app.use(helmet({ contentSecurityPolicy: false,}));

// app.use(
//     helmet.contentSecurityPolicy({
//         directives: {
//         "script-src": ["'self'", "api.mapbox.com","cdn.jsdelivr.net"],
//         "style-src": ["'self'","'unsafe-inline'","api.mapbox.com","cdn.jsdelivr.net"],
//         "img-src":["'self'","res.cloudinary.com"]
//     },
//     })
//   );


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
   
    console.log(req.query);
    //console.log(req.session);
    res.locals.currentUser= req.user;
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    next();
})



app.use("/",usersRoutes);
app.use("/campgrounds",campgroundsRoutes)
app.use("/campgrounds/:id/reviews",reviewsRoutes);



app.get('/',(req,res)=>{
    res.render('home')
});


app.all("*",(req,res,next)=>{
    next(new ExpressError("Page Not found",404))
})

app.use((err,req,res,next)=>{
    const {statusCode = 500} = err;
    if (!err.message) err.message="Oh no, something wrong";
    res.status(statusCode).render("error",{err});
})


const db=mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));
db.once("open",()=>{
    console.log("Database Connected");
    app.listen(3000,()=>{
            console.log('Serving on port 3000');
         });
});



// app.listen(3000,()=>{
//     console.log('Serving on port 3000');
// });