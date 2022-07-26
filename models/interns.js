const mongoose = require('mongoose')

const internSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
    },
    lastname:{
        type:String,
        required:true,
    },
    address:{
        type:String,
        required:true,
    },
    phone:{
        type:String,
        required:true,
    },
    idnumber:{
        type:Number,
        required:true,
    },
    natinumber:{
        type:Number,
        required:true,
    },
    course:{
        type:String,
        required:true,
    },
    birthdate:{
        type:String,
        required:true,
    },
})

module.exports = mongoose.model('Intern', internSchema)
