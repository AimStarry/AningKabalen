import { Router } from 'express';
import { createOrder, getMyOrders, getOrderById, cancelOrder } from '../controllers/orderController';
import { protect, requireRole } from '../middleware/auth';

const router = Router();
router.use(protect);
router.post('/',         requireRole('buyer'), createOrder);
router.get('/my',        getMyOrders);
router.get('/:id',       getOrderById);
router.patch('/:id/cancel', requireRole('buyer'), cancelOrder);
export default router;
