const Listing = require("../models/listing.js");
const initData = require("./data.js");

const initDB = async () =>
{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner:"6877f86cac204b653a7d444d" }));
    await Listing.insertMany(initData.data);
    console.log("Initialised succesfully");
}


 //initDB();
