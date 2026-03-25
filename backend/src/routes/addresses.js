const { Router } = require('express');
const { getMyAddresses, createAddress, updateAddress, deleteAddress } = require('../controllers/addressController');
const { protect } = require('../middleware/auth');

const router = Router();
router.use(protect);
router.get('/',     getMyAddresses);
router.post('/',    createAddress);
router.patch('/:id', updateAddress);
router.delete('/:id', deleteAddress);
module.exports = router;
