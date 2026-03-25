const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema(
  {
    user_id:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type:     { type: String, required: true },
    title:    { type: String, required: true },
    message:  { type: String, required: true },
    ref_id:   mongoose.Schema.Types.ObjectId,
    ref_type: String,
    is_read:  { type: Boolean, default: false },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: false } }
);

NotificationSchema.index({ user_id: 1, is_read: 1 });

module.exports = mongoose.model('Notification', NotificationSchema);
