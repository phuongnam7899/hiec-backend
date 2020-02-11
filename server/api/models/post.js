const mongoose = require("mongoose");
mongoose.set('useCreateIndex', true);
const Schema = mongoose.Schema;
const Model = mongoose.model;

const PostSchema = new Schema({
    tags : [String],
    user : {type : mongoose.Types.ObjectId, ref : "user",require : true},
    postTime : {type : Number, require : true},
    title : {type : String},
    content : {type : String, require : true},
    viewers : [String],
    claps : [String],
    comments : [{
        id : {type : String, require : true},
        user : {type : mongoose.Types.ObjectId, ref : "user", require : true},
        content : {type : String, require : true},
        time : {type : String, require : true},
        replies : [{
            user : {type : mongoose.Types.ObjectId, ref : "user", require : true},
            content : {type : String, require : true},
            time : {type : String, require : true}
        }]
    }]
})
PostSchema.index({'$**': 'text'})
export default Model("post",PostSchema);