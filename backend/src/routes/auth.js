const { Router } = require('express');
const { register, login, getMe, updateProfile, changePassword } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

const router = Router();
router.post('/register', register);
router.post('/login',    login);
router.get( '/me',       protect, getMe);
router.patch('/me',      protect, upload.single('avatar'), updateProfile);
router.patch('/me/password', protect, changePassword);
module.exports = router;
