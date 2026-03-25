const Notification = require('../models/Notification');
const { respond } = require('../utils/jwt');

const getMyNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ user_id: req.user.id }).sort('-created_at').limit(50);
    const unread = await Notification.countDocuments({ user_id: req.user.id, is_read: false });
    respond(res, 200, { unread, count: notifications.length, notifications });
  } catch (err) { next(err); }
};

const markRead = async (req, res, next) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { is_read: true });
    respond(res, 200, { message: 'Marked as read' });
  } catch (err) { next(err); }
};

const markAllRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ user_id: req.user.id, is_read: false }, { is_read: true });
    respond(res, 200, { message: 'All notifications marked as read' });
  } catch (err) { next(err); }
};

module.exports = { getMyNotifications, markRead, markAllRead };
