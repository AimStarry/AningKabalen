import { Router } from 'express';
import { getMyAddresses, createAddress, updateAddress, deleteAddress } from '../controllers/addressController';
import { protect } from '../middleware/auth';

const router = Router();
router.use(protect);
router.get('/',      getMyAddresses);
router.post('/',     createAddress);
router.patch('/:id', updateAddress);
router.delete('/:id', deleteAddress);
export default router;
