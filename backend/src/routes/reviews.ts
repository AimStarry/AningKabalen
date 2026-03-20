import { Router } from 'express';
import { createReview, getReviewsByTarget, deleteReview } from '../controllers/reviewController';
import { protect, requireRole } from '../middleware/auth';

const router = Router();
router.get('/target/:targetId', getReviewsByTarget);
router.use(protect);
router.post('/',    createReview);
router.delete('/:id', requireRole('admin'), deleteReview);
export default router;
