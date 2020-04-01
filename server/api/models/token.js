const mongoose = require('mongoose');
const Model = mongoose.model;
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
    token : {type : String},
    userID : {type : String},
    isActive : {type : Boolean, default: true}
});

export default Model('disabled_token',tokenSchema);