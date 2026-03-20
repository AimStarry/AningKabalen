import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
  user_id: mongoose.Types.ObjectId;
  type: string;
  title: string;
  message: string;
  ref_id?: mongoose.Types.ObjectId;
  ref_type?: string;
  is_read: boolean;
  created_at: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    user_id:  { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type:     { type: String, required: true },
    title:    { type: String, required: true },
    message:  { type: String, required: true },
    ref_id:   Schema.Types.ObjectId,
    ref_type: String,
    is_read:  { type: Boolean, default: false },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: false } }
);

NotificationSchema.index({ user_id: 1, is_read: 1 });

export default mongoose.model<INotification>('Notification', NotificationSchema);
