const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Model = mongoose.model;

const UserSchema = new Schema({
    isAdmin : {type : Boolean, require : true},
    account : {
        email : {type : String, require : true},
        password : {type :String, require : true}
    },
    profile : {
        name : {type : String, require : true},
        gender : {type : String},
        phoneNumber : {type : String},
        dob : {type : String, require: true},
        occupation : {
            isWorking : {type : Boolean, require : true},
            describe : {} // jobTitle - companyName or school - major
        },
        address : {type : String},
        avatar : {type : String, default : "https://i.pinimg.com/236x/8c/87/6e/8c876ed0976c074a8e7664fc21422fb0.jpg"}
    }
});
export default Model("user",UserSchema);