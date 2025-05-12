import Court from '../models/Court.js';
import User from '../models/User.js';
import Review from '../models/Review.js';
import { generateAvailability } from '../utils/generativeAvailability.js';

// Add a new court
export const addCourt = async (req, res) => {
  try {
    const { name, type, location, price, image, description, amenities, contact, } = req.body;

    const ownerId = req.user.id;

    // Validate input
    if (!name || !type || !location || !price || !image || !description || !amenities || !contact || !ownerId) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Find the user by ownerId
    const user = await User.findById(ownerId);
    if (!user) {
      return res.status(404).json({ message: 'Owner not found' });
    }

    // Create a new court
    const newCourt = new Court({ name, type, location, price,availability : generateAvailability(), image, description, amenities, contact, ownerId });
    await newCourt.save();

    res.status(201).json({ message: 'Court added successfully', court: newCourt });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Edit a court
export const editCourt = async (req, res) => {
  try {
    const { name, location, price, unavailableDays, description, amenities, contact } = req.body;
    const { courtId } = req.params;

    const updatedCourt = await Court.findByIdAndUpdate(
      courtId,
      { name, location, price, description, amenities, contact },
      { new: true }
    );

    if (!updatedCourt) {
      return res.status(404).json({ message: 'Court not found' });
    }

    if (unavailableDays && unavailableDays.length > 0) {
      for (const day of unavailableDays) {
        updatedCourt.availability = updatedCourt.availability.filter((a) => a.date !== day.date);
      }

      await updatedCourt.save();
    }

    res.json({ message: 'Court updated successfully', court: updatedCourt });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a court
export const deleteCourt = async (req, res) => {
  try {
    const { courtId } = req.params;

    // Delete court
    const deletedCourt = await Court.findByIdAndDelete(courtId);

    if (!deletedCourt) {
      return res.status(404).json({ message: 'Court not found' });
    }

    res.json({ message: 'Court deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all courts
export const getAllCourts = async (req, res) => {
  try {
    const courts = await Court.find().populate('ownerId'); // Populate ownerId
    for (const court of courts) {
      const reviews = await Review.find({ courtId: court._id });
      court.averageRating = reviews.length ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1) : 0;
    }
    res.json({ courts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a single court
export const getSingleCourt = async (req, res) => {
  try {
    const { courtId } = req.params;

    const court = await Court.findById(courtId).populate('ownerId'); 

    if (!court) {
      return res.status(404).json({ message: 'Court not found' });
    }

    res.json({ court });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Filter courts
export const filtredCourts = async (req, res) => {
  try {
    const { type, location, priceRange, date, amenities } = req.body;

    const typeArray = type ? type.split(',') : [];
    const amenitiesArray = amenities ? amenities.split(',') : [];
    const priceRangeArray = priceRange ? priceRange.split(',').map(Number) : [];
    const minPrice = priceRangeArray[0] || 0;
    const maxPrice = priceRangeArray[1] || Infinity;

    const query = {
      ...(typeArray.length > 0 && { type: { $in: typeArray } }),
      ...(location && { location: { $regex: new RegExp(location, 'i') } }),
      ...(amenitiesArray.length > 0 && { amenities: { $all: amenitiesArray } }),
      ...(priceRangeArray.length === 2 && { price: { $gte: minPrice, $lte: maxPrice } }),
      ...(date && { 'availability.date': { $eq: date } }),
    };

    const courts = await Court.find(query).populate('ownerId');

    // Convert courts to plain JavaScript objects and add averageRating
    const updatedCourts = await Promise.all(
      courts.map(async (court) => {
        const reviews = await Review.find({ courtId: court._id });
        const averageRating = reviews.length
          ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
          : 0;

        return {
          ...court.toObject(), // Convert Mongoose document to plain object
          averageRating, // Add the averageRating
        };
      })
    );

    res.json({ courts: updatedCourts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};



// get ownner courts
export const getOwnerCourts = async (req, res) => {
  try {
    const ownerId = req.user.id;

    const courts = await Court.find({ ownerId }).populate('ownerId'); // Populate ownerId

    res.json({ courts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


