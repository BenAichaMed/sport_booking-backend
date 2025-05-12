import  mongoose  from "mongoose";
const UserSchema = new mongoose.Schema({
    userId : String,
    name : {type: String, required: true},
    email : {type: String, required: true, unique: true},
    password : {type: String, required: true,},
    role : {type: String,enum: ["user", "admin","owner"] ,default: "user"},
    profilePicture: String,
    preferences: [String],
    createdAt: { type: Date, default: Date.now },
    bookings: [{ type : mongoose.Schema.Types.ObjectId, ref: 'Booking' }]
}, {timestamps: true});

export default mongoose.model("User", UserSchema);