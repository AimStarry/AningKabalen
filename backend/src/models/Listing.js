const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema(
  {
    farmer_id:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category_id:  { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
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

module.exports = mongoose.model('Listing', ListingSchema);
