const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const appConfig = require('./../../config/app.config');
const User = require('../user/user.model');
const ApiError = require('../api-error');

const logIn = async (email, password) => {
  const user = await User.findOne({ email }).populate('business');
  if (!user) {
    throw new ApiError(403, 'email not found');
  }

  if (!bcrypt.compareSync(password, user.password)) {
    throw new ApiError(403, 'password does not match');
  }

  const token = jwt.sign(
    { sub: user.id },
    appConfig.jwtSecret,
    { expiresIn: appConfig.jwtMaxAge },
  );

  return {
    userId: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    token,
    business: user.business,
  };
};

module.exports = {
  logIn,
};
