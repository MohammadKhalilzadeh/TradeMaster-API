const mongoose = require('mongoose')


const businessSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
    },
    owner:{
        type: String,
        required: true,
    },
    phone:{
        type: String,
        unique:false
    },
    email:{
        type: Number,
        required: true,
    },
    status:{
        type: Number,
        required: true,
        default: 0
    },

    latitude:{
        type:Number,
        required:true,
    },
    longitude:{
        type:Number,
        required:true,
    },

    address:{
        type:String,
        required:true
    },

    imgs:{
        type:[String],
    },

    sheba:{
        type:String,
        required:true
    },

    delivery:{
        type:Number,
        required:true
    },

    description:{
        type:String,
        required:true
    },

    datetime:{
        type: Date,
        required: true,
        default: Date.now()
    },
})


module.exports = mongoose.model('Business', businessSchema)