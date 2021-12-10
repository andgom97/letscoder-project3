const mongoose = require("mongoose");

const BikeSchema = new mongoose.Schema({
user:{
    type: mongoose.Types.ObjectId,
    ref: "User"
},
brand: {
    type: String,
    required: true  
},
model: {
    type: String,
    required: true  
}
})

module.exports = mongoose.model("Bike", BikeSchema)