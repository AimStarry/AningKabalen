const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema(
  {
    reviewer_id:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    target_id:      { type: mongoose.Schema.Types.ObjectId, required: true },
    target_type:    { type: String, enum: ['farmer','listing','buyer'], required: true },
    transaction_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' },
    rating:  { type: Number, required: true, min: 1, max: 5 },
    comment: String,
  },
  { timestamps: { createdAt: 'created_at', updatedAt: false } }
);

module.exports = mongoose.model('Review', ReviewSchema);
