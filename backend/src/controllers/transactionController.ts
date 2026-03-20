import { Request, Response, NextFunction } from 'express';
import Transaction from '../models/Transaction';
import AuditLog from '../models/AuditLog';
import { respond } from '../utils/jwt';
import { APIFeatures } from '../utils/apiFeatures';

export const getAllTransactions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const features = new APIFeatures(
      Transaction.find()
        .populate('buyer_id',  'name phone')
        .populate('farmer_id', 'name farm_details.farm_name')
        .populate('listing_id','crop_name images'),
      req.query as any
    ).filter().sort().paginate();
    const [transactions, total] = await Promise.all([features.query, Transaction.countDocuments()]);
    respond(res, 200, { total, count: transactions.length, transactions });
  } catch (err) { next(err); }
};

export const getMyTransactions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filter = req.user!.role === 'farmer'
      ? { farmer_id: req.user!.id }
      : { buyer_id:  req.user!.id };
    const transactions = await Transaction.find(filter)
      .populate('listing_id', 'crop_name images')
      .populate(req.user!.role === 'farmer' ? 'buyer_id' : 'farmer_id', 'name')
      .sort('-created_at');
    respond(res, 200, { count: transactions.length, transactions });
  } catch (err) { next(err); }
};

export const getTransactionById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const txn = await Transaction.findById(req.params.id)
      .populate('buyer_id farmer_id listing_id reservation_id');
    if (!txn) { res.status(404).json({ success: false, message: 'Transaction not found' }); return; }
    respond(res, 200, { transaction: txn });
  } catch (err) { next(err); }
};

export const updateTransactionStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status } = req.body;
    const allowed = ['pending','confirmed','processed','completed','cancelled'];
    if (!allowed.includes(status)) {
      res.status(400).json({ success: false, message: 'Invalid status value' }); return;
    }
    const txn = await Transaction.findByIdAndUpdate(
      req.params.id, { status }, { new: true }
    );
    if (!txn) { res.status(404).json({ success: false, message: 'Transaction not found' }); return; }

    // Audit log
    await AuditLog.create({
      actor_id: req.user!.id, actor_role: req.user!.role,
      action: 'UPDATE_TRANSACTION_STATUS', target_collection: 'transactions',
      target_id: txn._id, changes: { status },
      ip_address: req.ip,
    });
    respond(res, 200, { transaction: txn });
  } catch (err) { next(err); }
};

export const getPlatformStats = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const [totalTxns, pendingCount, totalRevenue] = await Promise.all([
      Transaction.countDocuments(),
      Transaction.countDocuments({ status: 'pending' }),
      Transaction.aggregate([
        { $match: { status: { $in: ['processed','completed'] } } },
        { $group: { _id: null, total: { $sum: '$total_amount' } } },
      ]),
    ]);
    respond(res, 200, {
      total_transactions: totalTxns,
      pending_transactions: pendingCount,
      total_revenue: totalRevenue[0]?.total ?? 0,
    });
  } catch (err) { next(err); }
};
