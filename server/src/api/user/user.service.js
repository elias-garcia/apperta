const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const appConfig = require('../../config/app.config');
const User = require('../user/user.model');
const PasswordResetToken = require('../password-reset-token/password-reset-token.model');
const scheduler = require('../../util/scheduler');
const ApiError = require('../api-error');

const register = async (email, password, firstName, lastName) => {
  const oldUser = await User.findOne({ email });
  if (oldUser) {
    throw new ApiError(409, 'user already exists');
  }

  const newUser = await User.create({
    email,
    password,
    firstName,
    lastName,
  });

  const token = jwt.sign(
    { sub: newUser.id },
    appConfig.jwtSecret,
    { expiresIn: appConfig.jwtMaxAge },
  );

  return {
    userId: newUser.id,
    firstName: newUser.firstName,
    lastName: newUser.lastName,
    role: newUser.role,
    token,
  };
};

const findById = async (userId) => {
  const user = await User.findById(userId, '-password');
  if (!user) {
    throw new ApiError(404, 'user not found');
  }

  return user;
};

const update = async (userId, email, firstName, lastName) => {
  const user = await User.findByIdAndUpdate(
    userId,
    {
      email,
      firstName,
      lastName,
    },
    { new: true },
  );

  if (!user) {
    throw new ApiError(404, 'user not found');
  }

  return user;
};

const changePassword = async (userId, oldPassword, newPassword, token) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, 'user not found');
  }

  if (token) {
    const dbToken = await PasswordResetToken.findOne({ user: userId });

    if (!bcrypt.compareSync(token, dbToken.value)) {
      throw new ApiError(422, 'unprocessable entity');
    }

    await scheduler.cancel({ data: { userId } });
    await dbToken.remove();
  }

  if (!bcrypt.compareSync(oldPassword, user.password)) {
    throw new ApiError(422, 'unprocessable entity');
  }

  user.password = newPassword;

  await user.save();
};

const remove = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, 'user not found');
  }

  await user.remove();
};

module.exports = {
  register,
  findById,
  update,
  changePassword,
  remove,
};
