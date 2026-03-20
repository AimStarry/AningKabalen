import { Router } from 'express';
import { getAllUsers, getUserById, updateVerificationStatus, deactivateUser, getFarmers } from '../controllers/userController';
import { protect, requireRole } from '../middleware/auth';

const router = Router();
router.get('/farmers', getFarmers);
router.use(protect);
router.get('/',              requireRole('admin'), getAllUsers);
router.get('/:id',           getUserById);
router.patch('/:id/verify',  requireRole('admin'), updateVerificationStatus);
router.patch('/:id/deactivate', requireRole('admin'), deactivateUser);
export default router;
