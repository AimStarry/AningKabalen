const mongoose = require('mongoose');

const ContactMessageSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName:  { type: String, required: true, trim: true },
    email:     { type: String, required: true, trim: true, lowercase: true },
    phone:     { type: String, required: true, trim: true },
    message:   { type: String, required: true },
    is_read:   { type: Boolean, default: false },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

ContactMessageSchema.index({ is_read: 1 });

module.exports = mongoose.model('ContactMessage', ContactMessageSchema);
