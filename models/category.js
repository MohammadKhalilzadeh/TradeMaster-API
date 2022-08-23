const mongoose = require('mongoose')


const categorySchema = new mongoose.Schema({
    // main info
    title:{
        type: String,
        required: true,
    },
    owner:{
        type: String,
        required: true,
    },
})


module.exports = mongoose.model('Category', categorySchema)