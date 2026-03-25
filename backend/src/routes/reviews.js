const { Router } = require('express');
const { createReview, getReviewsByTarget, deleteReview } = require('../controllers/reviewController');
const { protect, requireRole } = require('../middleware/auth');

const router = Router();
router.get('/target/:targetId', getReviewsByTarget);
router.use(protect);
router.post('/',    createReview);
router.delete('/:id', requireRole('admin'), deleteReview);
module.exports = router;
