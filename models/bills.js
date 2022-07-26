const mongoose = require('mongoose')


const billSchema = new mongoose.Schema({
    CustomerPhone:{
        type: String,
        required: true,
    },
    CustomerAddress:{
        type: String,
        required: true,
    },
    TotalPrice:{
        type: String,
        unique:false
    },
    PartnerShare:{
        type: Number,
        required: true,
    },
    Status:{
        type: String,
        required: true,
        default: "Pending"
    },
    Datetime:{
        type: Date,
        required: true,
        default: Date.now()
    },
    item:{
        type:mongoose.SchemaTypes.Mixed
    },
    items:{
        type: [{
            type:mongoose.SchemaTypes.Mixed
        }],
    },
    code:{
        type:String,
        require:true
    },
    authority:{
        type:String,
        require:true
    },
    refID:{
        type:String,
        require:true
    },
    extraDetail:{
        type:String,
        require:true
    },
    owner:{
        type:String,
        require:true
    }
})


module.exports = mongoose.model('Bill', billSchema)