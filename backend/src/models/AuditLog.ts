import mongoose, { Document, Schema } from 'mongoose';

export interface IAuditLog extends Document {
  actor_id: mongoose.Types.ObjectId;
  actor_role: string;
  action: string;
  target_collection: string;
  target_id: mongoose.Types.ObjectId;
  changes?: Record<string, any>;
  ip_address?: string;
  created_at: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    actor_id:           { type: Schema.Types.ObjectId, ref: 'User', required: true },
    actor_role:         { type: String, required: true },
    action:             { type: String, required: true },
    target_collection:  { type: String, required: true },
    target_id:          { type: Schema.Types.ObjectId, required: true },
    changes:            Schema.Types.Mixed,
    ip_address:         String,
  },
  { timestamps: { createdAt: 'created_at', updatedAt: false } }
);

export default mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
