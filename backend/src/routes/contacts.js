const { Router } = require('express');
const { createContactMessage, getAllContactMessages, markContactRead, deleteContactMessage } = require('../controllers/contactController');
const { protect, requireRole } = require('../middleware/auth');

const router = Router();
// Public: anyone can submit a contact form
router.post('/', createContactMessage);
// Admin only: view/manage messages
router.get('/',        protect, requireRole('admin'), getAllContactMessages);
router.patch('/:id/read',  protect, requireRole('admin'), markContactRead);
router.delete('/:id',      protect, requireRole('admin'), deleteContactMessage);
module.exports = router;
