const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const appConfig = require('../../config/app.config');
const ApiError = require('../api-error');
const PasswordResetToken = require('../password-reset-token/password-reset-token.model');
const scheduler = require('../../util/scheduler');
const User = require('../user/user.model');

const updateUserDetails = async (userId, email, firstName, lastName) => {
  const user = await User.findOne({ email });
  if (user) {
    if (user.id.toString() !== userId) {
      throw new ApiError(409, 'user already exists');
    }
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      email,
      firstName,
      lastName,
    },
    { new: true },
  );

  if (!updatedUser) {
    throw new ApiError(404, 'user not found');
  }

  return updatedUser;
};

const updatePassword = async (userId, oldPassword, newPassword) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, 'user not found');
  }

  if (!bcrypt.compareSync(oldPassword, user.password)) {
    throw new ApiError(422, 'unprocessable entity');
  }

  user.password = newPassword;

  await user.save();
};

const resetPassword = async (email, token, newPassword) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, 'user not found');
  }

  const dbToken = await PasswordResetToken.findOne({ email });

  if (!bcrypt.compareSync(token, dbToken.value)) {
    throw new ApiError(422, 'unprocessable entity');
  }

  await scheduler.cancel({ data: { email } });
  await dbToken.remove();

  user.password = newPassword;

  await user.save();

  const sessionToken = jwt.sign(
    { sub: user.id },
    appConfig.jwtSecret,
    { expiresIn: appConfig.jwtMaxAge },
  );

  return {
    userId: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    token: sessionToken,
    business: user.business,
  };
};

const remove = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, 'user not found');
  }

  await user.remove();
};

const activateUser = async (email, token) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, 'user not found');
  }

  if (!bcrypt.compareSync(token, user.activationToken)) {
    throw new ApiError(403, 'activation token does not match');
  }

  user.isActive = true;
  user.activationToken = undefined;

  await user.save();

  const sessionToken = jwt.sign(
    { sub: user.id },
    appConfig.jwtSecret,
    { expiresIn: appConfig.jwtMaxAge },
  );

  return {
    userId: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    token: sessionToken,
    business: undefined,
  };
};

module.exports = {
  updateUserDetails,
  updatePassword,
  resetPassword,
  remove,
  activateUser,
};
