const express = require("express");
const router = express.Router({mergeParams:true});
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controller/user.js");

//render sign up page
router.get("/signup",userController.index);

//new user sign up
router.post("/signup",wrapAsync(userController.createUser));

//render login page
router.get("/login",userController.renderLogin);

//user login
router.post("/login",
    saveRedirectUrl,
    passport.authenticate("local",{
    failureRedirect:"/login",
    failureFlash: true,
}),
userController.userLogin);

//logout
router.get("/logout",userController.userLogout)

module.exports = router;