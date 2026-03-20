import { Router } from 'express';
import {
  getAllTransactions, getMyTransactions, getTransactionById,
  updateTransactionStatus, getPlatformStats,
} from '../controllers/transactionController';
import { protect, requireRole } from '../middleware/auth';

const router = Router();
router.use(protect);
router.get('/stats', requireRole('admin'), getPlatformStats);
router.get('/',      requireRole('admin'), getAllTransactions);
router.get('/my',    getMyTransactions);
router.get('/:id',   getTransactionById);
router.patch('/:id/status', requireRole('admin','farmer'), updateTransactionStatus);
export default router;
