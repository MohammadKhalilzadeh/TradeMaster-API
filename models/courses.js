const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    teacher:{
        type:String,
        required:true,
    },
    capacity:{
        type:Number,
        required:true,
    },
    time:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    tuition:{
        type:Number,
        required:true,
    },
    poster:{
        type:String,
        required:true,
    },
    students:{
        type:[String],
    }
})

module.exports = mongoose.model('Course', courseSchema)