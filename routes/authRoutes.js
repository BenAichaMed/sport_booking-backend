import express from 'express';
import { registerUser, loginUser, getUserData } from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/user', authMiddleware, getUserData); // New route for fetching user data

export default router;