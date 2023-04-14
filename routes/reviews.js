const express= require("express");
const router= express.Router({mergeParams:true});

const {validateReview, isLoggedIn, isReviewAuthor}=require("../middleware");

const reviews=require("../controllers/reviews")
const Campground=require("../models/campground");
const Review = require("../models/reviews");

const ExpressError=require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");

router.post("/",validateReview,isLoggedIn,catchAsync(reviews.creatReview))

router.delete("/:reviewId",isLoggedIn,isReviewAuthor,catchAsync(reviews.deleteReview));

module.exports = router;

