const mongoose = require('mongoose')

const propertySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    phone:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    country:{
        type:String,
        required:true,
    },
    city:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    propnum:{
        type:Number,
        required:true,
    },
    type:{
        type:String,
        required:true,
    },
    specs:{
        type:mongoose.SchemaTypes.Mixed,
        required:true,
    },
    imgs:{
        type:[String],
        required:true,
    },
    sold:{
        type: Boolean,
        default: false,
    },
})

module.exports = mongoose.model('Property', propertySchema)