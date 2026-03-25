const { Router } = require('express');
const { createReservation, getMyReservations, getReservationById, updateReservationStatus, getAllReservations } = require('../controllers/reservationController');
const { protect, requireRole } = require('../middleware/auth');

const router = Router();
router.use(protect);
router.get('/',                    getMyReservations);
router.get('/all',   requireRole('admin'), getAllReservations);
router.post('/',     requireRole('buyer'), createReservation);
router.get('/:id',                 getReservationById);
router.patch('/:id/status',        updateReservationStatus);
module.exports = router;
