const mongoose = require("mongoose");

const TrackSchema = new mongoose.Schema({
kilometers:{
    type: Number,
    required: true
},
averageTimes:{
    type: Number,
    required: false
},
level:{
    type: mongoose.Types.ObjectId,
    ref: "Level"
},
startLocationLat:{
    type: Number,
    required: true
},
startLocationLong:{
    type: Number,
    required: true
},
endLocationLat:{
    type: Number,
    required: true
},
endLocationLong:{
    type: Number,
    required: true
}
})

module.exports = mongoose.model("Track", TrackSchema)