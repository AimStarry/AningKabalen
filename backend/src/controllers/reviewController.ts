import { Request, Response, NextFunction } from 'express';
import Review from '../models/Review';
import User from '../models/User';
import { respond } from '../utils/jwt';

export const createReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const existing = await Review.findOne({
      reviewer_id: req.user!.id,
      target_id:   req.body.target_id,
      target_type: req.body.target_type,
    });
    if (existing) { res.status(409).json({ success: false, message: 'Already reviewed' }); return; }

    const review = await Review.create({ ...req.body, reviewer_id: req.user!.id });

    // Update farmer rating if target_type is farmer
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

export const getReviewsByTarget = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reviews = await Review.find({ target_id: req.params.targetId })
      .populate('reviewer_id', 'name avatar_url')
      .sort('-created_at');
    respond(res, 200, { count: reviews.length, reviews });
  } catch (err) { next(err); }
};

export const deleteReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    respond(res, 200, { message: 'Review deleted' });
  } catch (err) { next(err); }
};
