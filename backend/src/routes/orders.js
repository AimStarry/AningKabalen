const { Router } = require('express');
const { createOrder, getMyOrders, getOrderById, cancelOrder } = require('../controllers/orderController');
const { protect, requireRole } = require('../middleware/auth');

const router = Router();
router.use(protect);
router.post('/',             requireRole('buyer'), createOrder);
router.get('/',              getMyOrders);
router.get('/:id',           getOrderById);
router.patch('/:id/cancel',  requireRole('buyer'), cancelOrder);
module.exports = router;
