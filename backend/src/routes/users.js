const { Router } = require('express');
const { getAllUsers, getUserById, updateVerificationStatus, deactivateUser, getFarmers } = require('../controllers/userController');
const { protect, requireRole } = require('../middleware/auth');

const router = Router();
router.get('/farmers', getFarmers);
router.use(protect);
router.get('/',              requireRole('admin'), getAllUsers);
router.get('/:id',           getUserById);
router.patch('/:id/verify',  requireRole('admin'), updateVerificationStatus);
router.patch('/:id/deactivate', requireRole('admin'), deactivateUser);
module.exports = router;
