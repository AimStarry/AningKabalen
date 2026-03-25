const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const { respond } = require('../utils/jwt');
const { APIFeatures } = require('../utils/apiFeatures');

const getAllUsers = async (req, res, next) => {
  try {
    const features = new APIFeatures(User.find(), req.query).filter().search(['name','email']).sort().paginate();
    const [users, total] = await Promise.all([features.query, User.countDocuments()]);
    respond(res, 200, { total, count: users.length, users });
  } catch (err) { next(err); }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).populate('address_id');
    if (!user) { res.status(404).json({ success: false, message: 'User not found' }); return; }
    respond(res, 200, { user });
  } catch (err) { next(err); }
};

const updateVerificationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowed = ['pending','verified','rejected','flagged'];
    if (!allowed.includes(status)) { res.status(400).json({ success: false, message: 'Invalid status' }); return; }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { verification_status: status, is_verified: status === 'verified' },
      { new: true }
    );
    if (!user) { res.status(404).json({ success: false, message: 'User not found' }); return; }

    await AuditLog.create({
      actor_id: req.user.id, actor_role: req.user.role,
      action: 'UPDATE_VERIFICATION', target_collection: 'users',
      target_id: user._id, changes: { verification_status: status }, ip_address: req.ip,
    });
    respond(res, 200, { user });
  } catch (err) { next(err); }
};

const deactivateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { is_active: false }, { new: true });
    if (!user) { res.status(404).json({ success: false, message: 'User not found' }); return; }
    respond(res, 200, { message: 'User deactivated', user });
  } catch (err) { next(err); }
};

const getFarmers = async (req, res, next) => {
  try {
    const features = new APIFeatures(
      User.find({ role: 'farmer', is_verified: true, is_active: true }), req.query
    ).search(['name', 'farm_details.farm_name']).sort().paginate();
    const farmers = await features.query;
    respond(res, 200, { count: farmers.length, farmers });
  } catch (err) { next(err); }
};

module.exports = { getAllUsers, getUserById, updateVerificationStatus, deactivateUser, getFarmers };
