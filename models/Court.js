import mongoose from "mongoose";

const timeSlots = [
  "00:00-01:00", "01:00-02:00", "02:00-03:00", "03:00-04:00", "04:00-05:00", "05:00-06:00",
  "06:00-07:00", "07:00-08:00", "08:00-09:00", "09:00-10:00", "10:00-11:00", "11:00-12:00",
  "12:00-13:00", "13:00-14:00", "14:00-15:00", "15:00-16:00", "16:00-17:00", "17:00-18:00",
  "18:00-19:00", "19:00-20:00", "20:00-21:00", "21:00-22:00", "22:00-23:00", "23:00-00:00"
];

const availabilitySchema = new mongoose.Schema({
  date: { type: String, required: true },
  timeSlots: { type: [String], default: timeSlots }
});

const CourtSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ["Tennis", "Padel", "Football", "Basketball"], required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  availability: [availabilitySchema],
  image: { type: String },
  description: { type: String },
  rating: { type: Number, default: 0 },
  amenities: [String],
  contact: { type: String, required: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

export default mongoose.model("Court", CourtSchema);