const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const { findByUsername } = require('./reviews');
const Schema=mongoose.Schema;

const UserSchema=new Schema({
    email:{
        type: String,
        require: true,
        unique:true
    },
    token:{
        type:String,
        default:""
    }
});


UserSchema.plugin(passportLocalMongoose);

module.exports= mongoose.model("User",UserSchema);

