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
        avatar : {type : String, default : "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQcVTlEXUHIyBJGKGKRcdKVOYhb22zka6_CZ0VwJ4z2c7wSlWw6&usqp=CAU"}
    }
});
export default Model("user",UserSchema);