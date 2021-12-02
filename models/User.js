const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
name:{
    type: String,
    required: true
},
email:{
    type: String,
    required: true
},
password:{
    type: Number,
    required: true
}
})

module.exports = mongoose.model("User", UserSchema)