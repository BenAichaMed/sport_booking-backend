import express from 'express';
const router = express.Router();

import {addReview, getReviews, deleteReview} from '../controllers/reviewController.js';
import authMiddleware from '../middleware/authMiddleware.js';

router.post('/add', authMiddleware, addReview);
router.get('/:courtId', getReviews);
router.delete('/:reviewId', authMiddleware, deleteReview);


export default router;
