const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const {validateReview, isLoggedIn, isReviewOwner} = require("../middleware.js");
const reviewController = require("../controller/review.js");
const {saveRedirectUrl} = require("../middleware.js");

//post route for reviews
router.post("/:id/reviews",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));

//delete route fot reviews
router.delete("/:id/reviews/:reviewId",isLoggedIn,saveRedirectUrl,isReviewOwner, wrapAsync(reviewController.destroy));

module.exports = router;