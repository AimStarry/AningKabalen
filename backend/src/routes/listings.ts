import { Router } from 'express';
import {
  getAllListings, getListingById, getMyListings,
  createListing, updateListing, deleteListing,
  getListingsByFarmer, updateListingStatus,
} from '../controllers/listingController';
import { protect, requireRole } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();
router.get('/',                     getAllListings);
router.get('/farmer/:farmerId',     getListingsByFarmer);
router.get('/:id',                  getListingById);
router.use(protect);
router.get('/my/listings',          getMyListings);
router.post('/',                    requireRole('farmer'), upload.array('images', 5), createListing);
router.patch('/:id',                requireRole('farmer'), upload.array('images', 5), updateListing);
router.patch('/:id/status',         requireRole('farmer','admin'), updateListingStatus);
router.delete('/:id',               requireRole('farmer','admin'), deleteListing);
export default router;
