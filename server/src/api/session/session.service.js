const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const appConfig = require('./../../config/app.config');
const User = require('../user/user.model');
const ApiError = require('../api-error');

const logIn = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(403, 'email not found');
  }

  if (!bcrypt.compareSync(password, user.password)) {
    throw new ApiError(403, 'password does not match');
  }

  const token = jwt.sign(
    { sub: user.id, role: user.role },
    appConfig.jwtSecret,
    { expiresIn: appConfig.jwtMaxAge },
  );

  const session = {
    userId: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    token,
  };

  if (user.business) {
    session.business = user.business;
  } else {
    session.business = '';
  }

  return session;
};

module.exports = {
  logIn,
};
