const { S3Client, DeleteObjectsCommand } = require('@aws-sdk/client-s3');
const Listing = require('../models/Listing');
const { respond } = require('../utils/jwt');
const { APIFeatures } = require('../utils/apiFeatures');

const s3 = new S3Client({
  region: process.env.AWS_REGION || 'ap-southeast-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET = 'aning-kabalen';

const extractKeyFromUrl = (url) => {
  try {
    const u = new URL(url);
    let key = u.pathname.replace(/^\/+/, '');
    if (key.startsWith(`${BUCKET}/`)) key = key.replace(`${BUCKET}/`, '');
    return key;
  } catch (err) {
    console.error('Invalid URL:', url);
    return null;
  }
};

const getAllListings = async (req, res, next) => {
  try {
    const features = new APIFeatures(
      Listing.find({ status: { $ne: 'draft' } })
        .populate('farmer_id', 'name avatar_url farm_details rating')
        .populate('category_id', 'name slug'),
      req.query
    ).filter().search(['crop_name','description','tags']).sort().paginate();

    const [listings, total] = await Promise.all([
      features.query,
      Listing.countDocuments({ status: { $ne: 'draft' } }),
    ]);
    respond(res, 200, { total, count: listings.length, listings });
  } catch (err) { next(err); }
};

const getListingById = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate('farmer_id', 'name avatar_url farm_details rating phone')
      .populate('category_id', 'name slug');
    if (!listing) { res.status(404).json({ success: false, message: 'Listing not found' }); return; }
    respond(res, 200, { listing });
  } catch (err) { next(err); }
};

const getMyListings = async (req, res, next) => {
  try {
    const listings = await Listing.find({ farmer_id: req.user.id })
      .populate('category_id', 'name slug')
      .sort('-created_at');
    respond(res, 200, { count: listings.length, listings });
  } catch (err) { next(err); }
};

const createListing = async (req, res, next) => {
  try {
    const images = req.files
      ? req.files.map(f => f.location)
      : [];
    const listing = await Listing.create({ ...req.body, farmer_id: req.user.id, images });
    respond(res, 201, { listing });
  } catch (err) { next(err); }
};

const updateListing = async (req, res, next) => {
  try {
    const listing = await Listing.findOne({ _id: req.params.id, farmer_id: req.user.id });
    if (!listing) { res.status(404).json({ success: false, message: 'Listing not found or not yours' }); return; }

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(f => f.location);
      const oldKeys = (listing.images || []).map(url => extractKeyFromUrl(url)).filter(k => !!k);
      if (oldKeys.length > 0) {
        await s3.send(new DeleteObjectsCommand({
          Bucket: BUCKET,
          Delete: { Objects: oldKeys.map(Key => ({ Key })) },
        }));
      }
      req.body.images = newImages;
    }

    const updated = await Listing.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    respond(res, 200, { listing: updated });
  } catch (err) { next(err); }
};

const deleteListing = async (req, res, next) => {
  try {
    const query = req.user.role === 'admin'
      ? { _id: req.params.id }
      : { _id: req.params.id, farmer_id: req.user.id };

    const listing = await Listing.findOne(query);
    if (!listing) { res.status(404).json({ success: false, message: 'Listing not found' }); return; }

    const imageKeys = (listing.images || []).map(url => extractKeyFromUrl(url)).filter(k => !!k);
    if (imageKeys.length > 0) {
      await s3.send(new DeleteObjectsCommand({
        Bucket: BUCKET,
        Delete: { Objects: imageKeys.map(Key => ({ Key })) },
      }));
    }

    await Listing.deleteOne({ _id: listing._id });
    respond(res, 200, { message: 'Listing deleted (including images)' });
  } catch (err) { next(err); }
};

const getListingsByFarmer = async (req, res, next) => {
  try {
    const listings = await Listing.find({ farmer_id: req.params.farmerId, status: { $ne: 'draft' } })
      .populate('category_id', 'name slug')
      .sort('-created_at');
    respond(res, 200, { count: listings.length, listings });
  } catch (err) { next(err); }
};

const updateListingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const listing = await Listing.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!listing) { res.status(404).json({ success: false, message: 'Listing not found' }); return; }
    respond(res, 200, { listing });
  } catch (err) { next(err); }
};

module.exports = { getAllListings, getListingById, getMyListings, createListing, updateListing, deleteListing, getListingsByFarmer, updateListingStatus };
