const { Router } = require('express');
const { getMyNotifications, markRead, markAllRead } = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');

const router = Router();
router.use(protect);
router.get('/',              getMyNotifications);
router.patch('/:id/read',    markRead);
router.patch('/read-all',    markAllRead);
module.exports = router;
