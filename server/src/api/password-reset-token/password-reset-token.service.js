const crypto = require('crypto');
const moment = require('moment');
const bcrypt = require('bcryptjs');
const appConfig = require('../../config/app.config');
const User = require('../user/user.model');
const PasswordResetToken = require('./password-reset-token.model');
const mailer = require('../../util/mailer');
const scheduler = require('../../util/scheduler');
const jobTypes = require('../../jobs/job-types.enum');
const ApiError = require('../api-error');

const createPasswordResetToken = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, 'user not found');
  }

  const oldToken = await PasswordResetToken.findOne({ user: user.id });
  if (oldToken) {
    await oldToken.remove();
  }

  const newToken = crypto.randomBytes(4).toString('hex');
  const issueDate = moment().utc();
  const expirationDate = issueDate.clone();

  expirationDate.add(appConfig.passwordResetTokenExpiration, 'seconds');

  const token = await PasswordResetToken.create({
    value: bcrypt.hashSync(newToken),
    issueDate: issueDate.format(),
    expirationDate: expirationDate.format(),
    user: user.id,
  });

  scheduler.schedule(
    expirationDate.toDate(),
    jobTypes.PASSWORD_RESET_TOKEN_EXPIRE,
    { tokenId: token.id, userId: user.id },
  );

  await mailer.sendPasswordResetToken(user.email, user.id, newToken);
};

module.exports = {
  createPasswordResetToken,
};
