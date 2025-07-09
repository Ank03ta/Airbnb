
const express = require("express");
const router = express.Router({mergeParams:true});
const methodOverride = require("method-override");
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn} = require("../middleware.js");
const {isOwner} = require("../middleware.js");
const {validateListing} = require("../middleware.js");
const listingsController = require("../controller/listing.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js"); 
const upload = multer({ storage });

router.use(methodOverride("_method"));
//index route
router.get("/",wrapAsync(listingsController.index));

//new route
router.get("/new",isLoggedIn, listingsController.renderNew)

//create new route
router.post("/",isLoggedIn,upload.single("listing[image]"),validateListing, wrapAsync(listingsController.createNewliating));

//show listing route
router.get("/:id",wrapAsync(listingsController.showListings));

// render edit form
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingsController.renderEdit));

//edit route
router.put("/:id",isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,wrapAsync(listingsController.editListing));

router.delete("/:id",isOwner,wrapAsync(listingsController.destroy));

module.exports = router;