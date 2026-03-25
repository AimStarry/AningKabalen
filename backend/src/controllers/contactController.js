const ContactMessage = require('../models/ContactMessage');
const { respond } = require('../utils/jwt');

const createContactMessage = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, message } = req.body;
    if (!firstName || !lastName || !email || !phone || !message) {
      res.status(400).json({ success: false, message: 'All fields are required.' });
      return;
    }
    const contact = await ContactMessage.create({ firstName, lastName, email, phone, message });
    respond(res, 201, { message: 'Message received. We will get back to you within 24 hours.', contact });
  } catch (err) { next(err); }
};

const getAllContactMessages = async (req, res, next) => {
  try {
    const messages = await ContactMessage.find().sort('-created_at');
    const unread = await ContactMessage.countDocuments({ is_read: false });
    respond(res, 200, { total: messages.length, unread, messages });
  } catch (err) { next(err); }
};

const markContactRead = async (req, res, next) => {
  try {
    const msg = await ContactMessage.findByIdAndUpdate(req.params.id, { is_read: true }, { new: true });
    if (!msg) { res.status(404).json({ success: false, message: 'Message not found' }); return; }
    respond(res, 200, { message: 'Marked as read', contact: msg });
  } catch (err) { next(err); }
};

const deleteContactMessage = async (req, res, next) => {
  try {
    await ContactMessage.findByIdAndDelete(req.params.id);
    respond(res, 200, { message: 'Message deleted' });
  } catch (err) { next(err); }
};

module.exports = { createContactMessage, getAllContactMessages, markContactRead, deleteContactMessage };
