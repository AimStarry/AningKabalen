import { Router } from 'express';
import { getMyNotifications, markRead, markAllRead } from '../controllers/notificationController';
import { protect } from '../middleware/auth';

const router = Router();
router.use(protect);
router.get('/',          getMyNotifications);
router.patch('/:id/read', markRead);
router.patch('/read-all', markAllRead);
export default router;
