import { Request, Response, NextFunction } from 'express';
import Category from '../models/Category';
import { respond } from '../utils/jwt';

export const getAllCategories = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await Category.find({ is_active: true }).sort('name');
    respond(res, 200, { count: categories.length, categories });
  } catch (err) { next(err); }
};

export const getCategoryById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cat = await Category.findById(req.params.id);
    if (!cat) { res.status(404).json({ success: false, message: 'Category not found' }); return; }
    respond(res, 200, { category: cat });
  } catch (err) { next(err); }
};

export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cat = await Category.create(req.body);
    respond(res, 201, { category: cat });
  } catch (err) { next(err); }
};

export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cat = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!cat) { res.status(404).json({ success: false, message: 'Category not found' }); return; }
    respond(res, 200, { category: cat });
  } catch (err) { next(err); }
};

export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    respond(res, 200, { message: 'Category deleted' });
  } catch (err) { next(err); }
};
