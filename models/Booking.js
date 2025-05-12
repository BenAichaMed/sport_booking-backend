import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  courtId: { type: mongoose.Schema.Types.ObjectId, ref: "Court", required: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
  date: { type: Date, required: true },
  timeSlot: { type: String, required: true }, 
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
  paymentStatus: { type: String, enum: ['paid', 'pending','onsite'], default: 'pending' },
}, { timestamps: true });

export default mongoose.model("Booking", bookingSchema);
