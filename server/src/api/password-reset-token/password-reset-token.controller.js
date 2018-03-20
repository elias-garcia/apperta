const ApiError = require('../api-error');
const passwordResetTokenService = require('./password-reset-token.service');

const createPasswordResetToken = async (req, res, next) => {
  try {
    if (!req.body.email) {
      throw new ApiError(422, 'unprocessable entity');
    }

    await passwordResetTokenService.createPasswordResetToken(req.body.email);

    return res.status(202).end();
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  createPasswordResetToken,
};
