import express from 'express';
import { createBooking, acceptBooking, rejectBooking, cancelBooking, getBookings, getSingleBooking, getTodaysInfos, getBookingsDetails, markAsOnsite,markAsPaid } from '../controllers/bookingController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create', authMiddleware, createBooking);
router.post('/accept', authMiddleware, acceptBooking);
router.post('/reject', authMiddleware, rejectBooking);
router.post('/cancel', authMiddleware, cancelBooking);
router.post('/:bookingId/mark-paid/', authMiddleware, markAsPaid);
router.post('/:bookingId/mark-onsite/', authMiddleware, markAsOnsite);
router.get('/', authMiddleware, getBookings);
router.get('/today', authMiddleware, getTodaysInfos);
router.get('/:bookingId', authMiddleware, getBookingsDetails);

export default router;