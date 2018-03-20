const mongoose = require('mongoose');

const passwordResetTokenSchema = new mongoose.Schema({
  value: {
    type: String,
    required: true,
    unique: true,
  },
  issueDate: {
    type: Date,
    required: true,
  },
  expirationDate: {
    type: Date,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
}, { timestamps: false });

const PasswordResetToken = mongoose.model('PasswordResetToken', passwordResetTokenSchema);

module.exports = PasswordResetToken;
