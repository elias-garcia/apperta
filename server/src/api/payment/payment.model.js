const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  business: {
    type: String,
    required: true,
  },
  stripeId: {
    type: String,
    required: true,
  },
  validUntil: {
    type: Date,
    required: true,
  },
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
