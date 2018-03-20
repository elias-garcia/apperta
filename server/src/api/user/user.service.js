const jwt = require('jsonwebtoken');
const appConfig = require('../../config/app.config');
const User = require('../user/user.model');
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

module.exports = {
  register,
  findById,
};
