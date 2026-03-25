const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema(
  {
    user_id:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    label:        { type: String, default: 'Home' },
    street:       { type: String, required: true },
    barangay:     { type: String, required: true },
    municipality: { type: String, required: true },
    province:     { type: String, required: true },
    region:       { type: String, required: true },
    zip_code:     { type: String, required: true },
    is_default:   { type: Boolean, default: false },
    coordinates:  { lat: Number, lng: Number },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

module.exports = mongoose.model('Address', AddressSchema);
