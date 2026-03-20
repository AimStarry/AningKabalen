import mongoose, { Document, Schema } from 'mongoose';

export interface ITransaction extends Document {
  reservation_id?: mongoose.Types.ObjectId;
  buyer_id: mongoose.Types.ObjectId;
  farmer_id: mongoose.Types.ObjectId;
  listing_id: mongoose.Types.ObjectId;
  type: 'reservation' | 'order';
  quantity_kg: number;
  unit_price: number;
  subtotal: number;
  platform_fee: number;
  total_amount: number;
  payment_method: string;
  payment_status: 'pending' | 'paid' | 'refunded' | 'failed';
  status: 'pending' | 'confirmed' | 'processed' | 'completed' | 'cancelled';
  pickup_date?: Date;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    reservation_id: { type: Schema.Types.ObjectId, ref: 'Reservation' },
    buyer_id:       { type: Schema.Types.ObjectId, ref: 'User', required: true },
    farmer_id:      { type: Schema.Types.ObjectId, ref: 'User', required: true },
    listing_id:     { type: Schema.Types.ObjectId, ref: 'Listing', required: true },
    type:           { type: String, enum: ['reservation','order'], required: true },
    quantity_kg:    { type: Number, required: true },
    unit_price:     { type: Number, required: true },
    subtotal:       { type: Number, required: true },
    platform_fee:   { type: Number, default: 0 },
    total_amount:   { type: Number, required: true },
    payment_method: { type: String, required: true },
    payment_status: { type: String, enum: ['pending','paid','refunded','failed'], default: 'pending' },
    status:         { type: String, enum: ['pending','confirmed','processed','completed','cancelled'], default: 'pending' },
    pickup_date:    Date,
    notes:          String,
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

TransactionSchema.index({ buyer_id: 1 });
TransactionSchema.index({ farmer_id: 1 });
TransactionSchema.index({ listing_id: 1 });
TransactionSchema.index({ status: 1 });

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);
