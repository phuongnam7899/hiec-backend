const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Model = mongoose.model;

const PostSchema = new Schema({
    tags : [String],
    user : {type : mongoose.Types.ObjectId, ref : "user",require : true},
    postTime : {type : String, require : true},
    title : {type : String},
    content : {type : String, require : true},
    viewer : [String],
    clap : [String],
    comments : [{
        user : {type : mongoose.Types.ObjectId, ref : "user", require : true},
        content : {type : String},
        time : {type : String},
        replies : [{
            user : {type : mongoose.Types.ObjectId, ref : "user", require : true},
            content : {type : String},
            time : {type : String, require : true}
        }]
    }]
})
export default Model("post",PostSchema);