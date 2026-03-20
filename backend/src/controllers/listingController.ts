import { Request, Response, NextFunction } from 'express';
import Listing from '../models/Listing';
import { respond } from '../utils/jwt';
import { APIFeatures } from '../utils/apiFeatures';

export const getAllListings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const features = new APIFeatures(
      Listing.find({ status: { $ne: 'draft' } })
        .populate('farmer_id', 'name avatar_url farm_details rating')
        .populate('category_id', 'name slug'),
      req.query as any
    ).filter().search(['crop_name','description','tags']).sort().paginate();

    const [listings, total] = await Promise.all([
      features.query,
      Listing.countDocuments({ status: { $ne: 'draft' } }),
    ]);
    respond(res, 200, { total, count: listings.length, listings });
  } catch (err) { next(err); }
};

export const getListingById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate('farmer_id', 'name avatar_url farm_details rating phone')
      .populate('category_id', 'name slug');
    if (!listing) { res.status(404).json({ success: false, message: 'Listing not found' }); return; }
    respond(res, 200, { listing });
  } catch (err) { next(err); }
};

export const getMyListings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const listings = await Listing.find({ farmer_id: req.user!.id })
      .populate('category_id', 'name slug')
      .sort('-created_at');
    respond(res, 200, { count: listings.length, listings });
  } catch (err) { next(err); }
};

export const createListing = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const images = req.files
      ? (req.files as Express.Multer.File[]).map(f => `/uploads/${f.filename}`)
      : [];
    const listing = await Listing.create({
      ...req.body,
      farmer_id: req.user!.id,
      images,
    });
    respond(res, 201, { listing });
  } catch (err) { next(err); }
};

export const updateListing = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const listing = await Listing.findOne({ _id: req.params.id, farmer_id: req.user!.id });
    if (!listing) { res.status(404).json({ success: false, message: 'Listing not found or not yours' }); return; }
    if (req.files?.length) {
      req.body.images = (req.files as Express.Multer.File[]).map(f => `/uploads/${f.filename}`);
    }
    const updated = await Listing.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    respond(res, 200, { listing: updated });
  } catch (err) { next(err); }
};

export const deleteListing = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = req.user!.role === 'admin'
      ? { _id: req.params.id }
      : { _id: req.params.id, farmer_id: req.user!.id };
    const listing = await Listing.findOneAndDelete(query);
    if (!listing) { res.status(404).json({ success: false, message: 'Listing not found' }); return; }
    respond(res, 200, { message: 'Listing deleted' });
  } catch (err) { next(err); }
};

export const getListingsByFarmer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const listings = await Listing.find({ farmer_id: req.params.farmerId, status: { $ne: 'draft' } })
      .populate('category_id', 'name slug')
      .sort('-created_at');
    respond(res, 200, { count: listings.length, listings });
  } catch (err) { next(err); }
};

export const updateListingStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status } = req.body;
    const listing = await Listing.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!listing) { res.status(404).json({ success: false, message: 'Listing not found' }); return; }
    respond(res, 200, { listing });
  } catch (err) { next(err); }
};
