import Booking from "../models/Booking.js";
import Court from "../models/Court.js";

// Create a Booking
export const createBooking = async (req, res) => {
  try {
    const { courtId, date, timeSlot } = req.body;
    const userId = req.user.id;
    

    const court = await Court.findById(courtId);
    if (!court) return res.status(404).json({ message: "Court not found" });

    const existingBooking = await Booking.findOne({ courtId, date, timeSlot,status:"pending" });

    if (existingBooking) return res.status(400).json({ message: "Time slot already booked" });

    const availability = court.availability.find((a) => a.date === date);
    if (!availability || !availability.timeSlots.includes(timeSlot)) {
      return res.status(400).json({ message: "Time slot not available" });
    }

    availability.timeSlots = availability.timeSlots.filter((t) => t !== timeSlot);

    await court.save();

    const newBooking = new Booking({
      userId,
      courtId,
      ownerId: court.ownerId,
      date,
      timeSlot,
      status: "pending",
      paymentStatus: 'pending',
    });

    await newBooking.save();
    res.status(201).json({ message: "Booking  success" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update booking status
export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updatedBooking = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: 'Error updating booking status', error });
  }
};

// Update payment status

export const markAsPaid = async (req, res) => {
  try {
    const { bookingId } = req.params;
    
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { paymentStatus: 'paid' },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error updating payment status', error });
  }
};

export const markAsOnsite = async (req, res) => {
  try {
    const { bookingId } = req.params;
    
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { paymentStatus: 'onsite' },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error updating payment status', error });
  }
};


// Cancel booking 
export const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.body; 
    const userId = req.user.id;

    console.log("Booking ID:", bookingId);
    console.log("User ID:", userId);

    // Find the booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      console.log("Booking not found");
      return res.status(404).json({ message: "Booking not found" });
    }

    console.log("Booking found:", booking);

    // Only the user who made the booking OR an admin can cancel
    if (booking.userId.toString() !== userId && req.user.role !== "admin") {
      console.log("Not authorized to cancel this booking");
      return res.status(403).json({ message: "Not authorized to cancel this booking" });
    }

    // If booking is still pending → Restore time slot
    if (booking.status === "pending") {
      const court = await Court.findById(booking.courtId);
      if (!court) {
        console.log("Court not found");
        return res.status(404).json({ message: "Court not found" });
      }

      const bookingDate = booking.date.toISOString().split('T')[0]; 

      const availability = court.availability.find(a => a.date === bookingDate);

      if (availability) {
        if (!availability.timeSlots.includes(booking.timeSlot)) {
          availability.timeSlots.push(booking.timeSlot);
          availability.timeSlots.sort(); // Ensure the time slots are sorted
          await court.save();
          console.log("Time slot restored:", booking.timeSlot);
        } else {
          console.log("Time slot already available:", booking.timeSlot);
        }
      } else {
        console.log("Availability not found for date:", bookingDate);
      }
      
      // Delete the booking
      await Booking.findByIdAndDelete(bookingId);
      console.log("Booking canceled and time slot restored");
      return res.json({ message: "Booking canceled and time slot restored" });
    }

    // If booking was already accepted, just mark it as "canceled"
    booking.status = "cancelled";
    await booking.save();

    console.log("Booking cancelled successfully");
    res.json({ message: "Booking cancelled successfully", booking });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};


//court owner part 
//Accept a Booking
export const acceptBooking = async (req, res) => {
  try {
    const { bookingId } = req.body;

    // Find the booking
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Update booking status to "booked"
    booking.status = "confirmed";
    await booking.save();

    res.json({ message: "Booking accepted successfully", booking });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


//Reject a Booking
export const rejectBooking = async (req, res) => {
  try {
    const { bookingId } = req.body;

    // Find the booking
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Find the court
    const court = await Court.findById(booking.courtId);
    if (!court) return res.status(404).json({ message: "Court not found" });

    // Find the date's availability and restore the time slot
    const availability = court.availability.find(a => a.date === booking.date);
    if (availability) {
      availability.timeSlots.push(booking.timeSlot);
      await court.save();
    }

    // Delete the rejected booking
    await Booking.findByIdAndDelete(bookingId);

    res.json({ message: "Booking rejected and time slot restored" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};





// Get all bookings (filtered by role)i will use this in the dashboard later 
export const getBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    let bookings;
    if (role === "admin") {
      bookings = await Booking.find().populate("userId courtId ownerId").sort({date: -1});
    } else if (role === "owner") {
      bookings = await Booking.find({ ownerId: userId }).populate("userId courtId").sort({date: -1});
    } else {
      bookings = await Booking.find({ userId }).populate("courtId").sort({date: -1});
    }

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getBookingsDetails = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId).populate('courtId');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching booking details', error });
  }
};


export const getSingleBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    // const userId = req.user.id;

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });  


    res.status(200).json(booking);
  }catch (error) {
    res.status(500).json({ message: error.message });
  }
}



export const getTodaysInfos = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    const today = new Date().toISOString().split('T')[0];

    // Find today's bookings
    const bookings = await Booking.find({ date: today, ownerId: userId }).populate("userId courtId");
    // Calculate today's revenue for confirmed bookings only
    const revenue = bookings
      .filter(booking => booking.status === "confirmed")
      .reduce((total, booking) => total + booking.courtId.price, 0);

    // Calculate court utilization rate
    const courts = await Court.find({ ownerId: userId });
    const totalSlots = courts.reduce((total, court) => {
      const availability = court.availability.find(a => a.date === today);
      return total + (availability ? availability.timeSlots.length : 0);
    }, 0);
    const bookedSlots = bookings.filter(booking => booking.status === "confirmed").length;
    const utilizationRate = totalSlots > 0 ? ((bookedSlots / totalSlots) * 100).toFixed(1) : 0;

    res.status(200).json({
      bookedSlots,
      revenue,
      utilizationRate
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

