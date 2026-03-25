const Category = require('../models/Category');
const { respond } = require('../utils/jwt');

const getAllCategories = async (_req, res, next) => {
  try {
    const categories = await Category.find({ is_active: true }).sort('name');
    respond(res, 200, { count: categories.length, categories });
  } catch (err) { next(err); }
};

const getCategoryById = async (req, res, next) => {
  try {
    const cat = await Category.findById(req.params.id);
    if (!cat) { res.status(404).json({ success: false, message: 'Category not found' }); return; }
    respond(res, 200, { category: cat });
  } catch (err) { next(err); }
};

const createCategory = async (req, res, next) => {
  try {
    const cat = await Category.create(req.body);
    respond(res, 201, { category: cat });
  } catch (err) { next(err); }
};

const updateCategory = async (req, res, next) => {
  try {
    const cat = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!cat) { res.status(404).json({ success: false, message: 'Category not found' }); return; }
    respond(res, 200, { category: cat });
  } catch (err) { next(err); }
};

const deleteCategory = async (req, res, next) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    respond(res, 200, { message: 'Category deleted' });
  } catch (err) { next(err); }
};

module.exports = { getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory };
