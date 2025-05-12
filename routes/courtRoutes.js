import express from 'express';
const router = express.Router();

import { addCourt, editCourt, deleteCourt, getAllCourts, getSingleCourt, filtredCourts, getOwnerCourts } from '../controllers/courtController.js';
import authMiddleware from '../middleware/authMiddleware.js'; 

router.post('/add',authMiddleware, addCourt);
router.post('/search', filtredCourts);
router.put('/edit/:courtId',authMiddleware, editCourt);
router.delete('/delete/:courtId', deleteCourt);
router.get('/list', getAllCourts);
router.get('/mycourts',authMiddleware, getOwnerCourts); 
router.get('/:courtId', getSingleCourt);

export default router;

