const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name:{
        type: String,
        required:true,
    },
    unit:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    owner:{
        type:String,
        required:true,
    },
    available:{
        type:Boolean,
        required:true,
    },
    imagename:{
        type:String,
    }

})

module.exports = mongoose.model('Product', productSchema)