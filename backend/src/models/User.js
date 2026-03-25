const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    name:                { type: String, required: true, trim: true },
    email:               { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone:               { type: String, required: true, trim: true },
    password_hash:       { type: String, required: true },
    role:                { type: String, enum: ['farmer','buyer','admin'], default: 'buyer' },
    avatar_url:          { type: String, default: null },
    is_verified:         { type: Boolean, default: false },
    is_active:           { type: Boolean, default: true },
    verification_status: { type: String, enum: ['pending','verified','rejected','flagged'], default: 'pending' },
    farm_details: {
      farm_name:          String,
      farm_size_hectares: Number,
      years_farming:      Number,
      primary_crops:      [String],
      certifications:     [String],
    },
    buyer_details: {
      business_name: String,
      business_type: { type: String, enum: ['retail','wholesale','restaurant','individual'] },
    },
    address_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Address' },
    rating: {
      average: { type: Number, default: 0 },
      count:   { type: Number, default: 0 },
    },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password_hash')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password_hash = await bcrypt.hash(this.password_hash, salt);
  next();
});

UserSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password_hash);
};

UserSchema.set('toJSON', {
  transform: (_doc, ret) => { delete ret.password_hash; return ret; },
});

module.exports = mongoose.model('User', UserSchema);
