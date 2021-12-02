const mongoose = require("mongoose");

const LevelSchema = new mongoose.Schema({
tag:{
    type: String,
    required: true
}
})

module.exports = mongoose.model("Level", LevelSchema)