const { Router } = require('express');
const { getAllTransactions, getMyTransactions, getTransactionById, updateTransactionStatus, getPlatformStats } = require('../controllers/transactionController');
const { protect, requireRole } = require('../middleware/auth');

const router = Router();
router.use(protect);
router.get('/stats',  requireRole('admin'), getPlatformStats);
router.get('/',       requireRole('admin'), getAllTransactions);
router.get('/my',     getMyTransactions);
router.get('/:id',    getTransactionById);
router.patch('/:id/status', requireRole('admin'), updateTransactionStatus);
module.exports = router;
