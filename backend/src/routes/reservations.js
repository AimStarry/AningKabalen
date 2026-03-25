const { Router } = require('express');
const { createReservation, getMyReservations, getReservationById, updateReservationStatus, getAllReservations } = require('../controllers/reservationController');
const { protect, requireRole } = require('../middleware/auth');

const router = Router();
router.use(protect);
router.post('/',              requireRole('buyer'), createReservation);
router.get('/my',             getMyReservations);
router.get('/all',            requireRole('admin'), getAllReservations);
router.get('/:id',            getReservationById);
router.patch('/:id/status',   updateReservationStatus);
module.exports = router;