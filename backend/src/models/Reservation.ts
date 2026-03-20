import mongoose, { Document, Schema } from 'mongoose';

export interface IReservation extends Document {
  buyer_id: mongoose.Types.ObjectId;
  farmer_id: mongoose.Types.ObjectId;
  listing_id: mongoose.Types.ObjectId;
  quantity_kg: number;
  unit_price: number;
  total_amount: number;
  payment_method: 'mastercard' | 'visa' | 'paypal' | 'gpay' | 'gcash' | 'maya' | 'cod';
  payment_status: 'pending' | 'paid' | 'refunded' | 'failed';
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  pickup_schedule?: Date;
  expiration_date?: Date;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

const ReservationSchema = new Schema<IReservation>(
  {
    buyer_id:       { type: Schema.Types.ObjectId, ref: 'User', required: true },
    farmer_id:      { type: Schema.Types.ObjectId, ref: 'User', required: true },
    listing_id:     { type: Schema.Types.ObjectId, ref: 'Listing', required: true },
    quantity_kg:    { type: Number, required: true, min: 0.1 },
    unit_price:     { type: Number, required: true },
    total_amount:   { type: Number, required: true },
    payment_method: { type: String, enum: ['mastercard','visa','paypal','gpay','gcash','maya','cod'] },
    payment_status: { type: String, enum: ['pending','paid','refunded','failed'], default: 'pending' },
    status:         { type: String, enum: ['pending','confirmed','cancelled','completed'], default: 'pending' },
    pickup_schedule: Date,
    expiration_date: Date,
    notes: String,
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

ReservationSchema.index({ buyer_id: 1 });
ReservationSchema.index({ farmer_id: 1 });
ReservationSchema.index({ listing_id: 1 });

export default mongoose.model<IReservation>('Reservation', ReservationSchema);
