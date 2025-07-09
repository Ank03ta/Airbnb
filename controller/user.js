const User = require("../models/user.js");

module.exports.index = (req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.createUser = async(req, res)=>{
    try{
    let {username, email, password} = req.body;
    const newUser = new User({email, username});
    const registeredUser = await User.register(newUser,password);
    req.login(registeredUser,(err) => {
        if(err){
            next(err);
        }
        req.flash("success", "welcome to the wonderlust!" );
    res.redirect("/listings");
    });

}catch(e){
    req.flash("error",e.message);
    res.redirect("/signup");
}
}

module.exports.renderLogin = (req, res)=>
{
    res.render("users/login.ejs")
}

module.exports.userLogin = async(req, res)=>{
req.flash("success", "Welcome back!");
let redirectUrl = res.locals.redirectUrl || "/listings";
res.redirect(redirectUrl);
}

module.exports.userLogout = (req, res)=>{
    req.logOut((err) => {
        if(err){
            next(err);
        }
        req.flash("success","you are logged out!");
        res.redirect("/listings");
    })
}