import { Request, Response, NextFunction } from 'express';
import Reservation from '../models/Reservation';
import Listing from '../models/Listing';
import Transaction from '../models/Transaction';
import Notification from '../models/Notification';
import { respond } from '../utils/jwt';

export const createReservation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const listing = await Listing.findById(req.body.listing_id);
    if (!listing) { res.status(404).json({ success: false, message: 'Listing not found' }); return; }
    if (listing.status !== 'available') { res.status(400).json({ success: false, message: 'Listing not available' }); return; }

    const qty = parseFloat(req.body.quantity_kg);
    if (qty > listing.available_kg) {
      res.status(400).json({ success: false, message: `Only ${listing.available_kg} kg available` }); return;
    }

    const total = qty * listing.price_per_kg;
    const expiry = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48h

    const reservation = await Reservation.create({
      buyer_id:        req.user!.id,
      farmer_id:       listing.farmer_id,
      listing_id:      listing._id,
      quantity_kg:     qty,
      unit_price:      listing.price_per_kg,
      total_amount:    total,
      payment_method:  req.body.payment_method,
      pickup_schedule: req.body.pickup_schedule,
      expiration_date: expiry,
      notes:           req.body.notes,
    });

    // Update listing available_kg
    await Listing.findByIdAndUpdate(listing._id, { $inc: { available_kg: -qty } });

    // Notify farmer
    await Notification.create({
      user_id: listing.farmer_id,
      type: 'NEW_RESERVATION',
      title: 'New Reservation',
      message: `A buyer reserved ${qty} kg of your ${listing.crop_name}.`,
      ref_id: reservation._id,
      ref_type: 'Reservation',
    });

    respond(res, 201, { reservation });
  } catch (err) { next(err); }
};

export const getMyReservations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filter = req.user!.role === 'farmer'
      ? { farmer_id: req.user!.id }
      : { buyer_id: req.user!.id };
    const reservations = await Reservation.find(filter)
      .populate('listing_id', 'crop_name images price_per_kg')
      .populate('buyer_id',   'name phone')
      .populate('farmer_id',  'name farm_details.farm_name')
      .sort('-created_at');
    respond(res, 200, { count: reservations.length, reservations });
  } catch (err) { next(err); }
};

export const getReservationById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const res_ = await Reservation.findById(req.params.id)
      .populate('listing_id buyer_id farmer_id');
    if (!res_) { res.status(404).json({ success: false, message: 'Reservation not found' }); return; }
    respond(res, 200, { reservation: res_ });
  } catch (err) { next(err); }
};

export const updateReservationStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status } = req.body;
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) { res.status(404).json({ success: false, message: 'Reservation not found' }); return; }

    const oldStatus = reservation.status;
    reservation.status = status;
    await reservation.save();

    // If confirmed → create Transaction record
    if (status === 'confirmed' && oldStatus !== 'confirmed') {
      const fee = reservation.total_amount * 0.02; // 2% platform fee
      await Transaction.create({
        reservation_id: reservation._id,
        buyer_id:       reservation.buyer_id,
        farmer_id:      reservation.farmer_id,
        listing_id:     reservation.listing_id,
        type:           'reservation',
        quantity_kg:    reservation.quantity_kg,
        unit_price:     reservation.unit_price,
        subtotal:       reservation.total_amount,
        platform_fee:   fee,
        total_amount:   reservation.total_amount + fee,
        payment_method: reservation.payment_method ?? 'pending',
        status:         'confirmed',
      });
    }

    // If cancelled → restore available_kg
    if (status === 'cancelled' && oldStatus !== 'cancelled') {
      await Listing.findByIdAndUpdate(reservation.listing_id, {
        $inc: { available_kg: reservation.quantity_kg },
      });
    }

    respond(res, 200, { reservation });
  } catch (err) { next(err); }
};

export const getAllReservations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reservations = await Reservation.find()
      .populate('listing_id', 'crop_name')
      .populate('buyer_id',  'name')
      .populate('farmer_id', 'name farm_details.farm_name')
      .sort('-created_at');
    respond(res, 200, { count: reservations.length, reservations });
  } catch (err) { next(err); }
};
