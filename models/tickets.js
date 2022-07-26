const mongoose = require('mongoose')

const ticketsSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
    },
    lastname:{
        type:String,
        required:true,
    },
    desc:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    seen:{
        type:Boolean,
        required:true,
        default:false,
    }
})

module.exports = mongoose.model('Tickets', ticketsSchema)