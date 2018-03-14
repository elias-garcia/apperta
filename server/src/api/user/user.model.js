/* eslint-disable func-names */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Roles = require('./roles.enum');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: Object.keys(Roles).map(key => Roles[key]),
    required: true,
    default: Roles.USER,
  },
}, { timestamps: true });

userSchema.pre('save', function (next) {
  const user = this;

  if (!user.isModified('password')) {
    return next();
  }

  try {
    this.password = bcrypt.hashSync(user.password);
  } catch (err) {
    return next(err);
  }

  return next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
