const mongoose = require('mongoose')

const empSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
    },
    lastname:{
        type:String,
        required:true,
    },
    idnumber:{
        type:Number,
        required:true,
    },
    username:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    educations:{
        type:Boolean,
    },
    bills:{
        type:Boolean,
    },
    advertise:{
        type:Boolean,
    },
    product:{
        type:Boolean,
    },
    requests:{
        type:Boolean,
    },
    tickets:{
        type:Boolean,
    },
    orders:{
        type:Boolean,
    },
    identifying:{
        type:Boolean,
    },
    allies:{
        type:Boolean,
    },
    settings:{
        type:Boolean,
    },
})

module.exports = mongoose.model('Employee', empSchema)