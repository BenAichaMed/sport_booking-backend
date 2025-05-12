import Review from "../models/Review.js";

// Add a review
export const addReview = async (req, res) => {
    try {
      const { courtId, rating, comment } = req.body; 
  
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: "Unauthorized: No user found" });
      }
  
      const newReview = new Review({
        userId: req.user.id, 
        courtId,
        rating,
        comment,
      });
  
      await newReview.save();
      res.status(201).json({ message: "Review added successfully", review: newReview });
    } catch (error) {
      console.error("Error adding review:", error);
      res.status(500).json({ message: "Error adding review", error: error.message });
    }
  };
  

// Get reviews for a court
export const getReviews = async (req, res) => {
  try {
    const { courtId } = req.params;
    const reviews = await Review.find({ courtId }).populate("userId", "name");

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : 0;

    res.status(200).json({reviews, averageRating});
  } catch (error) {
    res.status(500).json({ message: "Error fetching reviews", error });
  }
};

// Delete review (only author or admin can delete)
export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (req.user.id !== review.userId.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this review" });
    }

    await review.deleteOne();
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting review", error });
  }
};

