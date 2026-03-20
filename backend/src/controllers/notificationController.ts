import { Request, Response, NextFunction } from 'express';
import Notification from '../models/Notification';
import { respond } from '../utils/jwt';

export const getMyNotifications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const notifications = await Notification.find({ user_id: req.user!.id }).sort('-created_at').limit(50);
    const unread = await Notification.countDocuments({ user_id: req.user!.id, is_read: false });
    respond(res, 200, { unread, count: notifications.length, notifications });
  } catch (err) { next(err); }
};

export const markRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { is_read: true });
    respond(res, 200, { message: 'Marked as read' });
  } catch (err) { next(err); }
};

export const markAllRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await Notification.updateMany({ user_id: req.user!.id, is_read: false }, { is_read: true });
    respond(res, 200, { message: 'All notifications marked as read' });
  } catch (err) { next(err); }
};
