if(process.env.NODE_ENV != "production"){
require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const app1 = require("./init/app.js");
const path = require("path");
const methodOverride = require("method-override"); 
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/expressError.js");
const session = require("express-session");
const MongoDBStore = require("connect-mongo");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js")
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


const ATLAS_DB_URL = process.env.ATLAS_DB_URL 

main().then(()=>
{
    console.log("connected succsefully");
})
.catch((err)=>
{
    console.log(err);
})

async function main() {
    await mongoose.connect(ATLAS_DB_URL);
}


app.set("view engine","ejs");
app.set("views",path.join(__dirname, "/views"));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"public")));


const store =  MongoDBStore.create({
    mongoUrl: ATLAS_DB_URL,
    crypto:{
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600, // 24 hours
    });
    store.on("error", function (err) {
    console.log("Session store error:", err);
});


const sessionOption = {
    store: store,
    secret:process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly:true,
    },
};




app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize()); 
app.use(passport.session()); 
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser()); 
passport.deserializeUser(User.deserializeUser()); 


// Flash middleware (run after session)
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    next();
});

app.get('/', (req, res) => {
  res.redirect('/listings'); 
});

app.use("/listings", listingRouter);
app.use("/listings", reviewRouter);
app.use("/", userRouter);


// AFTER all routes
app.use((req, res, next) => {
    next(new ExpressError("Page not found!", 404));
});

// THEN error middleware
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("error.ejs", { err });
});


const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

