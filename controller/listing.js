const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.index = async(req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
    
}

module.exports.renderNew = async(req,res)=>{
    res.render("listings/new.ejs");
}

module.exports.createNewliating = async (req, res, next)=>
{
    let url = req.file.path;
    let filename = req.file.filename;
    
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    await newListing.save();
    req.session.flash = { success: "Listing created successfully!" };
    res.redirect("/listings");
}

module.exports.showListings = async(req, res)=>
{
    let {id}= req.params;
    const listing = await Listing.findById(id)
    .populate({
        path: "reviews",
        populate:{
            path: "author",
        },
     })
    .populate("owner");
    if(!listing)
    {
        req.flash("error","Listing you requested for does not existed");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
}

module.exports.renderEdit = async(req,res) =>
{
    let {id}= req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}

module.exports.editListing = async(req,res)=>
{
    let {id}= req.params;   
    let listing = await Listing.findByIdAndUpdate(id,req.body.listing);

    if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url, filename};
    }
    await listing.save();

    req.session.flash = { success: "Listing updated successfully!" };
    res.redirect(`/listings/${id}`);
}

module.exports.destroy = async(req, res)=>
{
    let {id}= req.params;
    const deletelist = await Listing.findByIdAndDelete(id);
    console.log( deletelist );
    req.session.flash = { success: "Listing deleted successfully!" };
    res.redirect("/listings");
}