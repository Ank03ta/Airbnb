const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email:{
        type:String,
        required:true
    }
});

// passport automatically includes username and password(hash and salt function) 

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);