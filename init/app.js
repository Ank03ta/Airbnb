const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initData = require("./data.js");

const mongo_URL = "mongodb://127.0.0.1:27017/wonderlust";

main().then(()=>
{
   // console.log("connected to db succsefully");
})
.catch((err)=>
{
    console.log(err);
})

async function main() {
    await mongoose.connect(mongo_URL);
}

const initDB = async () =>
{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner:"6862e7d6c3d83908507cdded" }));
    await Listing.insertMany(initData.data);
    console.log("Initialised succesfully");
}


// initDB();