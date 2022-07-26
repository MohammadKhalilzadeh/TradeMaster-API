const mongoose = require('mongoose')

const freelancerSchema = new mongoose.Schema({
    fullname:{
        type: String,
        required:true,
    },
    country:{
        type:String,
        required:true,
    },
    team:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },

})

module.exports = mongoose.model('Freelancer', freelancerSchema)