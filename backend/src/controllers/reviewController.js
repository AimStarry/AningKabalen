const Review = require('../models/Review');
const User = require('../models/User');
const { respond } = require('../utils/jwt');

const createReview = async (req, res, next) => {
  try {
    const existing = await Review.findOne({ reviewer_id: req.user.id, target_id: req.body.target_id, target_type: req.body.target_type });
    if (existing) { res.status(409).json({ success: false, message: 'Already reviewed' }); return; }

    const review = await Review.create({ ...req.body, reviewer_id: req.user.id });

    if (req.body.target_type === 'farmer') {
      const reviews = await Review.find({ target_id: req.body.target_id, target_type: 'farmer' });
      const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
      await User.findByIdAndUpdate(req.body.target_id, {
        'rating.average': Math.round(avg * 10) / 10,
        'rating.count':   reviews.length,
      });
    }
    respond(res, 201, { review });
  } catch (err) { next(err); }
};

const getReviewsByTarget = async (req, res, next) => {
  try {
    const reviews = await Review.find({ target_id: req.params.targetId })
      .populate('reviewer_id', 'name avatar_url')
      .sort('-created_at');
    respond(res, 200, { count: reviews.length, reviews });
  } catch (err) { next(err); }
};

const deleteReview = async (req, res, next) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    respond(res, 200, { message: 'Review deleted' });
  } catch (err) { next(err); }
};

module.exports = { createReview, getReviewsByTarget, deleteReview };
