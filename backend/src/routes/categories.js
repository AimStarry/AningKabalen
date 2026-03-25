const { Router } = require('express');
const { getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const { protect, requireRole } = require('../middleware/auth');

const router = Router();
router.get('/',    getAllCategories);
router.get('/:id', getCategoryById);
router.use(protect, requireRole('admin'));
router.post('/',    createCategory);
router.patch('/:id', updateCategory);
router.delete('/:id', deleteCategory);
module.exports = router;
