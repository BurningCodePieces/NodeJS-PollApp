const mongoose = require('mongoose')

const answerSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    first_answer:{
        type:Number,
        required:true
    },
    second_answer:{
        type:Number,
        required:true
    },
    third_answer:{
        type:Number,
        required:true
    } 

})

module.exports = mongoose.model('answer', answerSchema)