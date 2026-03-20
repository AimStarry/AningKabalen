import { Router } from 'express';
import { getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory } from '../controllers/categoryController';
import { protect, requireRole } from '../middleware/auth';

const router = Router();
router.get('/',    getAllCategories);
router.get('/:id', getCategoryById);
router.use(protect, requireRole('admin'));
router.post('/',    createCategory);
router.patch('/:id', updateCategory);
router.delete('/:id', deleteCategory);
export default router;
