import { Request, Response, NextFunction } from 'express';
import Address from '../models/Address';
import { respond } from '../utils/jwt';

export const getMyAddresses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const addresses = await Address.find({ user_id: req.user!.id }).sort('-is_default');
    respond(res, 200, { count: addresses.length, addresses });
  } catch (err) { next(err); }
};

export const createAddress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // If new address is default, unset all others
    if (req.body.is_default) {
      await Address.updateMany({ user_id: req.user!.id }, { is_default: false });
    }
    const address = await Address.create({ ...req.body, user_id: req.user!.id });
    respond(res, 201, { address });
  } catch (err) { next(err); }
};

export const updateAddress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.body.is_default) {
      await Address.updateMany({ user_id: req.user!.id }, { is_default: false });
    }
    const address = await Address.findOneAndUpdate(
      { _id: req.params.id, user_id: req.user!.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!address) { res.status(404).json({ success: false, message: 'Address not found' }); return; }
    respond(res, 200, { address });
  } catch (err) { next(err); }
};

export const deleteAddress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const address = await Address.findOneAndDelete({ _id: req.params.id, user_id: req.user!.id });
    if (!address) { res.status(404).json({ success: false, message: 'Address not found' }); return; }
    respond(res, 200, { message: 'Address deleted' });
  } catch (err) { next(err); }
};
