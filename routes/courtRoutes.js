const express = require('express');
const router = express.Router();

const {addCourt,editCourt,deleteCourt,getAllCourts,getSingleCourt} = require('../controllers/courtController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/add',addCourt);
router.post('/edit/:courtId',authMiddleware,editCourt);
router.post('/delete/:courtId', authMiddleware, deleteCourt);
router.get('/list', getAllCourts);
router.get('/:courtId', getSingleCourt);



module.exports = router;  


