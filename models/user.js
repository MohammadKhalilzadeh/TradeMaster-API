const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
    // main info
    firstname:{
        type: String,
        required: true,
    },
    lastname:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique:true,
        match: /([-!#-'*+/-9=?A-Z^-~]+(\.[-!#-'*+/-9=?A-Z^-~]+)*|"([]!#-[^-~ \t]|(\\[\t -~]))+")@[0-9A-Za-z]([0-9A-Za-z-]{0,61}[0-9A-Za-z])?(\.[0-9A-Za-z]([0-9A-Za-z-]{0,61}[0-9A-Za-z])?)+/
    },
    phone:{
        type: String,
        required: true,
        unique:true,
    },
    password:{
        type: String,
        required: true,
    },
    // system role
    role:{
        type: String,
        required: true,
        default: "customer"
    },
    // account states
    permium:{
        type: mongoose.Schema.Types.Mixed,
    },
    owner:{
        type: Boolean,
        default: false,
    },
    // selling items
    books:{
        type : [String],
    },
    // identifications
    cardnumber:{
        type: Number,
        default: 0,
    },
    sheba:{
        type: String,
        default: "-",
    },
    city:{
        type: String,
        default:"-",
    },
    province:{
        type: String,
        default:"-",
    },
    address:{
        type: String,
        default:"-",
    },
    postalcode:{
        type: Number,
        default: 0,
    },
    imgs:{
        type: [String],
    },
    verified:{
        type: Boolean,
        default:false,
    },
    token:{
        type: String,
    },
})


module.exports = mongoose.model('User', userSchema)