const mongoose = require("mongoose");

const RegistrySchema = new mongoose.Schema({
track:{
    type: mongoose.Types.ObjectId,
    ref: "Track"
},
user:{
    type: mongoose.Types.ObjectId,
    ref: "User"
},
miliseconds:{
    type: Number,
    required: true
},
timeStamp:{
    type: Date,
    required: true
},
bike:{
    type: mongoose.Types.ObjectId,
    ref: "Bike"
},
config:{
    type: mongoose.Types.ObjectId,
    ref: "Config"
},
})

module.exports = mongoose.model("Registry", RegistrySchema)