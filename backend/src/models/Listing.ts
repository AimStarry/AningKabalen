import mongoose, { Document, Schema } from 'mongoose';

export interface IListing extends Document {
  farmer_id: mongoose.Types.ObjectId;
  category_id: mongoose.Types.ObjectId;
  crop_name: string;
  variety?: string;
  description: string;
  quantity: number;
  quantity_kg: number;
  available_kg: number;
  price_per_kg: number;
  unit: string;
  images: string[];
  tags: string[];
  status: 'available' | 'reserved' | 'sold_out' | 'draft';
  harvest_date?: Date;
  expiry_date?: Date;
  created_at: Date;
  updated_at: Date;
}

const ListingSchema = new Schema<IListing>(
  {
    farmer_id:    { type: Schema.Types.ObjectId, ref: 'User', required: true },
    category_id:  { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    crop_name:    { type: String, required: true, trim: true },
    variety:      String,
    description:  { type: String, required: true },
    quantity:     { type: Number, required: true, min: 0 },
    quantity_kg:  { type: Number, required: true, min: 0 },
    available_kg: { type: Number, required: true, min: 0 },
    price_per_kg: { type: Number, required: true, min: 0 },
    unit:         { type: String, default: 'kg' },
    images:       [{ type: String }],
    tags:         [{ type: String }],
    status:       { type: String, enum: ['available','reserved','sold_out','draft'], default: 'available' },
    harvest_date: Date,
    expiry_date:  Date,
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

ListingSchema.index({ farmer_id: 1 });
ListingSchema.index({ category_id: 1 });
ListingSchema.index({ status: 1 });
ListingSchema.index({ crop_name: 'text', description: 'text', tags: 'text' });

export default mongoose.model<IListing>('Listing', ListingSchema);
