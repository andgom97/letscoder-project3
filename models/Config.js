const mongoose = require("mongoose");

const ConfigSchema = new mongoose.Schema({
bike:{
    type: mongoose.Types.ObjectId,
    ref: "Bike"
},
frame:{
    type: String,
    required: true
},
saddle:{
    type: String,
    required: true
},
fork:{
    type: String,
    required: true
},
transmission:{
    type: String,
    required: true
},
brakes:{
    type: String,
    required: true
},
sprocket:{
    type: String,
    required: true
},
plate:{
    type: String,
    required: true
}
})

module.exports = mongoose.model("Config", ConfigSchema)