const mongoose = require("mongoose");
mongoose.set('useCreateIndex', true);
const Schema = mongoose.Schema;
const Model = mongoose.model;

const NewsSchema = new Schema({
    category : {type : String},
    tags : [String],
    postTime : {type : String, require : true},
    title : {type : String},
    content : {type : String, require : true},
    viewer : [String]
})
export default Model("new",NewsSchema);