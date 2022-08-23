const mongoose = require('mongoose')


const itemSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    owner:{
        type: String,
        required: true,
    },
    price:{
        type: String,
        required: true,
    },
    unit:{
        type: String,
        required: true,
    },
    isavailable:{
        type: Boolean,
        required: true,
        default:true,
    },
    description:{
        type: String,
        required: true,
    },
    colors:{
        type: [String],
        required:true,
    },
    sizes:{
        type: [String],
        required:true,
    },
    images:{
        type: [String],
        required:true,
    },
})


module.exports = mongoose.model('Item', itemSchema)