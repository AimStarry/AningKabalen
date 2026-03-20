import { Request, Response, NextFunction } from 'express';
import Listing from '../models/Listing';
import Transaction from '../models/Transaction';
import Notification from '../models/Notification';
import { respond } from '../utils/jwt';

/**
 * ORDER = direct purchase. Buyer picks items from cart and buys immediately.
 * Creates a Transaction of type 'order' directly (no reservation step needed).
 * Reduces available_kg on the listing immediately.
 */
export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { items, payment_method, delivery_address, notes } = req.body;
    // items: [{ listing_id, quantity_kg }]

    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ success: false, message: 'Order must have at least one item.' });
      return;
    }

    const createdTransactions = [];

    for (const item of items) {
      const listing = await Listing.findById(item.listing_id);
      if (!listing) {
        res.status(404).json({ success: false, message: `Listing ${item.listing_id} not found.` });
        return;
      }
      if (listing.status !== 'available') {
        res.status(400).json({ success: false, message: `${listing.crop_name} is not available.` });
        return;
      }
      const qty = parseFloat(item.quantity_kg);
      if (qty > listing.available_kg) {
        res.status(400).json({ success: false, message: `Only ${listing.available_kg} ${listing.unit} of ${listing.crop_name} available.` });
        return;
      }

      const subtotal     = qty * listing.price_per_kg;
      const platform_fee = Math.round(subtotal * 0.02 * 100) / 100;
      const total_amount = subtotal + platform_fee;

      // Create transaction immediately
      const txn = await Transaction.create({
        buyer_id:       req.user!.id,
        farmer_id:      listing.farmer_id,
        listing_id:     listing._id,
        type:           'order',
        quantity_kg:    qty,
        unit_price:     listing.price_per_kg,
        subtotal,
        platform_fee,
        total_amount,
        payment_method: payment_method ?? 'cod',
        payment_status: payment_method === 'cod' ? 'pending' : 'paid',
        status:         'confirmed',   // Orders are confirmed immediately
        notes:          notes ?? delivery_address,
      });

      // Deduct stock immediately
      await Listing.findByIdAndUpdate(listing._id, {
        $inc: { available_kg: -qty },
        ...(listing.available_kg - qty <= 0 ? { status: 'sold_out' } : {}),
      });

      // Notify farmer
      await Notification.create({
        user_id:  listing.farmer_id,
        type:     'NEW_ORDER',
        title:    'New Order Received',
        message:  `${qty} ${listing.unit} of ${listing.crop_name} ordered. Total: ₱${total_amount.toFixed(2)}.`,
        ref_id:   txn._id,
        ref_type: 'Transaction',
      });

      createdTransactions.push(txn);
    }

    respond(res, 201, {
      message: 'Order placed successfully!',
      transactions: createdTransactions,
      count: createdTransactions.length,
    });
  } catch (err) { next(err); }
};

export const getMyOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const transactions = await Transaction.find({
      buyer_id: req.user!.id,
      type: 'order',
    })
      .populate('listing_id', 'crop_name images price_per_kg unit')
      .populate('farmer_id', 'name farm_details')
      .sort('-created_at');
    respond(res, 200, { count: transactions.length, transactions });
  } catch (err) { next(err); }
};

export const getOrderById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const txn = await Transaction.findOne({ _id: req.params.id, type: 'order' })
      .populate('listing_id')
      .populate('buyer_id', 'name phone email')
      .populate('farmer_id', 'name farm_details phone');
    if (!txn) { res.status(404).json({ success: false, message: 'Order not found.' }); return; }
    respond(res, 200, { transaction: txn });
  } catch (err) { next(err); }
};

export const cancelOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const txn = await Transaction.findOne({ _id: req.params.id, buyer_id: req.user!.id, type: 'order' });
    if (!txn) { res.status(404).json({ success: false, message: 'Order not found.' }); return; }
    if (txn.status === 'completed' || txn.status === 'processed') {
      res.status(400).json({ success: false, message: 'Cannot cancel a completed order.' }); return;
    }
    txn.status = 'cancelled';
    await txn.save();
    // Restore stock
    await Listing.findByIdAndUpdate(txn.listing_id, { $inc: { available_kg: txn.quantity_kg } });
    respond(res, 200, { message: 'Order cancelled.', transaction: txn });
  } catch (err) { next(err); }
};
