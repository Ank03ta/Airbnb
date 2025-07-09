const Listing = require("./models/listing");
const ExpressError = require("./utils/expressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");

//authntication
module.exports.isLoggedIn = (req, res, next) =>{
if(!req.isAuthenticated()){
    req.session.redirect = req.originalUrl;
        req.flash("error","You must logged in!")
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirect){
        res.locals.redirectUrl = req.session.redirect;
    }
    next();
} 

//Authrization
module.exports.isOwner = async(req, res, next) =>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currentUser._id)){
        req.flash("error","permission denied! You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

//validate for listing
module.exports.validateListing = (req, res, next)=>
{
    let { error } = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(errMsg, 400);
    }else
    {
        next();
    }
};

//validate for review
module.exports.validateReview = (req, res, next)=>
{
    let { error } = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(errMsg, 400);
    }
    else{
        next();
    }
};

module.exports.isReviewOwner = async(req, res, next) =>{
    let {id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currentUser._id)){
        req.flash("error","permission denied! You are not the Author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}