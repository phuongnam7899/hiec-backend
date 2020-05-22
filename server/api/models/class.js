const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');
const Model = mongoose.model;

const ClassSchema = new Schema({
    name : {type : String},
    code : {type : String},

    //TO-DO: Lưu thông tin student ra một collection riêng rồi ref sang
    students : [{
        name: {type : String},
        email: {type : String}
    }]
})
ClassSchema.plugin(mongoosePaginate)

export default Model("classe",ClassSchema);