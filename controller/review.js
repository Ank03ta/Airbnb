const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.createReview = async(req, res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.reviews);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.session.flash = { success: "Review successfully!" };
    res.redirect(`/listings/${listing._id}`);
}

module.exports.destroy = async (req, res)=>
{
    let {id, reviewId} = req.params;
    Listing.findByIdAndUpdate(id, {$pull:{reviews: reviewId}}); // made upadate in listing which made by deleting the review
    await Review.findByIdAndDelete(reviewId); // deleting from review array
    req.session.flash = { success: "Review deleted successfully!" };
    res.redirect(`/listings/${id}`)
}