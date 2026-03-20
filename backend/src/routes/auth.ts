import { Router } from 'express';
import { register, login, getMe, updateProfile, changePassword } from '../controllers/authController';
import { protect } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();
router.post('/register', register);
router.post('/login',    login);
router.get( '/me',       protect, getMe);
router.patch('/me',      protect, upload.single('avatar'), updateProfile);
router.patch('/me/password', protect, changePassword);
export default router;
