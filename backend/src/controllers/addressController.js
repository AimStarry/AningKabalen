const Address = require('../models/Address');
const { respond } = require('../utils/jwt');

const getMyAddresses = async (req, res, next) => {
  try {
    const addresses = await Address.find({ user_id: req.user.id }).sort('-is_default');
    respond(res, 200, { count: addresses.length, addresses });
  } catch (err) { next(err); }
};

const createAddress = async (req, res, next) => {
  try {
    if (req.body.is_default) {
      await Address.updateMany({ user_id: req.user.id }, { is_default: false });
    }
    const address = await Address.create({ ...req.body, user_id: req.user.id });
    respond(res, 201, { address });
  } catch (err) { next(err); }
};

const updateAddress = async (req, res, next) => {
  try {
    if (req.body.is_default) {
      await Address.updateMany({ user_id: req.user.id }, { is_default: false });
    }
    const address = await Address.findOneAndUpdate(
      { _id: req.params.id, user_id: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!address) { res.status(404).json({ success: false, message: 'Address not found' }); return; }
    respond(res, 200, { address });
  } catch (err) { next(err); }
};

const deleteAddress = async (req, res, next) => {
  try {
    const address = await Address.findOneAndDelete({ _id: req.params.id, user_id: req.user.id });
    if (!address) { res.status(404).json({ success: false, message: 'Address not found' }); return; }
    respond(res, 200, { message: 'Address deleted' });
  } catch (err) { next(err); }
};

module.exports = { getMyAddresses, createAddress, updateAddress, deleteAddress };
