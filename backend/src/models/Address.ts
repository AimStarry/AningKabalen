import mongoose, { Document, Schema } from 'mongoose';

export interface IAddress extends Document {
  user_id: mongoose.Types.ObjectId;
  label: string;
  street: string;
  barangay: string;
  municipality: string;
  province: string;
  region: string;
  zip_code: string;
  is_default: boolean;
  coordinates?: { lat: number; lng: number };
}

const AddressSchema = new Schema<IAddress>(
  {
    user_id:      { type: Schema.Types.ObjectId, ref: 'User', required: true },
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

export default mongoose.model<IAddress>('Address', AddressSchema);
