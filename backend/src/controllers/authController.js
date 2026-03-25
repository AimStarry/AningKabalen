const User = require('../models/User');
const { signToken, respond } = require('../utils/jwt');

const register = async (req, res, next) => {
  try {
    const { name, email, phone, password, role, farm_details, buyer_details } = req.body;
    const exists = await User.findOne({ email });
    if (exists) { res.status(409).json({ success: false, message: 'Email already registered' }); return; }

    const user = await User.create({
      name, email, phone,
      password_hash: password,
      role: role ?? 'buyer',
      farm_details:  role === 'farmer' ? farm_details : undefined,
      buyer_details: role === 'buyer'  ? buyer_details : undefined,
    });
    const token = signToken(user._id.toString(), user.role);
    respond(res, 201, { token, user });
  } catch (err) { next(err); }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) { res.status(400).json({ success: false, message: 'Email and password required' }); return; }

    const user = await User.findOne({ email }).select('+password_hash');
    if (!user || !(await user.comparePassword(password))) {
      res.status(401).json({ success: false, message: 'Invalid credentials' }); return;
    }
    if (!user.is_active) { res.status(403).json({ success: false, message: 'Account deactivated' }); return; }

    const token = signToken(user._id.toString(), user.role);
    respond(res, 200, { token, user });
  } catch (err) { next(err); }
};

const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('address_id');
    if (!user) { res.status(404).json({ success: false, message: 'User not found' }); return; }
    respond(res, 200, { user });
  } catch (err) { next(err); }
};

const updateProfile = async (req, res, next) => {
  try {
    const forbidden = ['password_hash', 'role', 'is_verified', 'verification_status'];
    forbidden.forEach(f => delete req.body[f]);
    if (req.file) req.body.avatar_url = req.file.location || `/uploads/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(req.user.id, req.body, { new: true, runValidators: true });
    respond(res, 200, { user });
  } catch (err) { next(err); }
};

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id).select('+password_hash');
    if (!user || !(await user.comparePassword(currentPassword))) {
      res.status(401).json({ success: false, message: 'Current password incorrect' }); return;
    }
    user.password_hash = newPassword;
    await user.save();
    respond(res, 200, { message: 'Password updated' });
  } catch (err) { next(err); }
};

module.exports = { register, login, getMe, updateProfile, changePassword };
