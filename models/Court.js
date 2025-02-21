const mongoose = require("mongoose");

const CourtSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ["Tennis", "Padel", "Football", "Basketball"], required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  availability: [{ date: String, timeSlots: [String] }],
  image: { type: String }, 
  description : { type: String },
  rating: { type: Number, default: 0 },
  reviews: [{ user: String, review: String }],
  amenties: [String],
  contact: { type: String, required: true },
});

module.exports = mongoose.model("Court", CourtSchema);
