const mongoose = require("mongoose");

const BikeSchema = new mongoose.Schema({
user:{
    type: mongoose.Types.ObjectId,
    ref: "User"
}
})

module.exports = mongoose.model("Bike", BikeSchema)