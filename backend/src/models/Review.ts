import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  reviewer_id: mongoose.Types.ObjectId;
  target_id: mongoose.Types.ObjectId;
  target_type: 'farmer' | 'listing' | 'buyer';
  transaction_id?: mongoose.Types.ObjectId;
  rating: number;
  comment?: string;
  created_at: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    reviewer_id:    { type: Schema.Types.ObjectId, ref: 'User', required: true },
    target_id:      { type: Schema.Types.ObjectId, required: true },
    target_type:    { type: String, enum: ['farmer','listing','buyer'], required: true },
    transaction_id: { type: Schema.Types.ObjectId, ref: 'Transaction' },
    rating:  { type: Number, required: true, min: 1, max: 5 },
    comment: String,
  },
  { timestamps: { createdAt: 'created_at', updatedAt: false } }
);

export default mongoose.model<IReview>('Review', ReviewSchema);
