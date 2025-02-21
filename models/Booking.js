const bookingSchema = new mongoose.Schema({
    bookingId: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    courtId: { type: mongoose.Schema.Types.ObjectId, ref: 'Court' },
    date: Date,
    startTime: String,
    endTime: String,
    totalPrice: Number,
    status: { type: String, enum: ['confirmed', 'pending', 'cancelled'], default: 'pending' },
  });