const { Router } = require('express');
const { getAllListings, getListingById, getMyListings, createListing, updateListing, deleteListing, getListingsByFarmer, updateListingStatus } = require('../controllers/listingController');
const { protect, requireRole } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

const router = Router();
router.get('/',                     getAllListings);
router.get('/my',      protect,     getMyListings);
router.get('/farmer/:farmerId',     getListingsByFarmer);
router.get('/:id',                  getListingById);
router.post('/',       protect, requireRole('farmer'), upload.array('images', 5), createListing);
router.patch('/:id',   protect, requireRole('farmer','admin'), upload.array('images', 5), updateListing);
router.patch('/:id/status', protect, requireRole('admin'), updateListingStatus);
router.delete('/:id',  protect, requireRole('farmer','admin'), deleteListing);
module.exports = router;
