const mongoose = require('mongoose')

const alliesSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    phone:{
        type:String,
        required:true,
    },
    address:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    sheba:{
        type:String,
        required:true,
    },
    logo:{
        type:String,
    }
})

module.exports = mongoose.model('Allies', alliesSchema)