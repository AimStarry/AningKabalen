import { Router } from 'express';
import {
  createReservation, getMyReservations, getReservationById,
  updateReservationStatus, getAllReservations,
} from '../controllers/reservationController';
import { protect, requireRole } from '../middleware/auth';

const router = Router();
router.use(protect);
router.get('/',     requireRole('admin'), getAllReservations);
router.get('/my',   getMyReservations);
router.post('/',    requireRole('buyer'), createReservation);
router.get('/:id',  getReservationById);
router.patch('/:id/status', requireRole('farmer','admin'), updateReservationStatus);
export default router;
