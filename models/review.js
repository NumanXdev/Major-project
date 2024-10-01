const mongoose = require("mongoose");
//mongoose.Schema-> stored into variable Schema so that while creating schema we dont need to write as mongoose.Schema
const Schema = mongoose.Schema;

const reviewSchema=new Schema({
    comment:String,
    rating:{
        type:Number,
        min:1,
        max:5,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
    },
});

module.exports = mongoose.model("Review",reviewSchema);