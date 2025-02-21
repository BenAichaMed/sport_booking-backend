const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    userId : String,
    name : {type: String, required: true},
    email : {type: String, required: true, unique: true},
    password : {type: String, required: true},
    role : {type: String,enum: ["user", "admin"] ,default: "user"},
    profilePicture: String,
    preferences: [String],
    bookings: [{ type : mongoose.Schema.Types.ObjectId, ref: 'Booking' }]
}, {timestamps: true});

module.exports = mongoose.model("User", UserSchema);