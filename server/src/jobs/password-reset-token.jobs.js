const PasswordResetToken = require('../api/password-reset-token/password-reset-token.model');
const jobTypes = require('./job-types.enum');

const expireToken = (jobTypes.PASSWORD_RESET_TOKEN_EXPIRE, async (job) => {
  const dbToken = await PasswordResetToken.findOne({ email: job.attrs.data.email });

  await dbToken.remove();
});

module.exports = {
  expireToken,
};

