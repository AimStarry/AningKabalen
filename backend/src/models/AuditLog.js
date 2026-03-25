const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema(
  {
    actor_id:          { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    actor_role:        { type: String, required: true },
    action:            { type: String, required: true },
    target_collection: { type: String, required: true },
    target_id:         { type: mongoose.Schema.Types.ObjectId, required: true },
    changes:           mongoose.Schema.Types.Mixed,
    ip_address:        String,
  },
  { timestamps: { createdAt: 'created_at', updatedAt: false } }
);

module.exports = mongoose.model('AuditLog', AuditLogSchema);
