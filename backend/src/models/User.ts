import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  password_hash: string;
  role: 'farmer' | 'buyer' | 'admin';
  avatar_url?: string;
  is_verified: boolean;
  is_active: boolean;
  verification_status: 'pending' | 'verified' | 'rejected' | 'flagged';
  farm_details?: {
    farm_name: string;
    farm_size_hectares: number;
    years_farming: number;
    primary_crops: string[];
    certifications: string[];
  };
  buyer_details?: {
    business_name?: string;
    business_type: 'retail' | 'wholesale' | 'restaurant' | 'individual';
  };
  address_id?: mongoose.Types.ObjectId;
  rating: { average: number; count: number };
  created_at: Date;
  updated_at: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
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
    address_id: { type: Schema.Types.ObjectId, ref: 'Address' },
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

UserSchema.methods.comparePassword = async function (candidate: string) {
  return bcrypt.compare(candidate, this.password_hash);
};

UserSchema.set('toJSON', {
  transform: (_doc: any, ret: any) => { delete ret.password_hash; return ret; },
});

export default mongoose.model<IUser>('User', UserSchema);
