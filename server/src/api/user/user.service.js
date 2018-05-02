const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const User = require('../user/user.model');
const ApiError = require('../api-error');
const mailer = require('../../util/mailer');

const register = async (email, password, firstName, lastName) => {
  const oldUser = await User.findOne({ email });

  if (oldUser) {
    throw new ApiError(409, 'user already exists');
  }

  const activationToken = crypto.randomBytes(4).toString('hex');

  const user = await User.create({
    email,
    password,
    firstName,
    lastName,
    activationToken: bcrypt.hashSync(activationToken),
  });

  mailer.sendUserActivationToken(email, activationToken);

  return user;
};

const findById = async (userId) => {
  const user = await User.findById(userId, '-password');

  if (!user) {
    throw new ApiError(404, 'user not found');
  }

  return user;
};

module.exports = {
  register,
  findById,
};
