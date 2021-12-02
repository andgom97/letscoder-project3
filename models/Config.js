const mongoose = require("mongoose");

const ConfigSchema = new mongoose.Schema({
bike:{
    type: mongoose.Types.ObjectId,
    ref: "Bike"
},
cuadro:{
    type: String,
    required: true
},
sillin:{
    type: String,
    required: true
},
horquilla:{
    type: String,
    required: true
},
transmision:{
    type: String,
    required: true
},
frenos:{
    type: String,
    required: true
},
piñon:{
    type: String,
    required: true
},
plato:{
    type: String,
    required: true
}
})

module.exports = mongoose.model("Config", ConfigSchema)