const ApiError = require('../api-error');
const meService = require('./me.service');
const userDto = require('../user/user.dto');
const json = require('../../util/json');

const updateUserDetails = async (req, res, next) => {
  try {
    if (!req.body.email ||
      !req.body.firstName ||
      !req.body.lastName) {
      throw new ApiError(422, 'unprocessable entity');
    }

    const user = await meService.updateUserDetails(
      req.user.sub,
      req.body.email,
      req.body.firstName,
      req.body.lastName,
    );

    return res.status(200).json(json.createData([{ title: 'user', data: userDto.toUserDto(user) }]));
  } catch (err) {
    return next(err);
  }
};

const updatePassword = async (req, res, next) => {
  try {
    if (!req.body.oldPassword ||
      !req.body.newPassword) {
      throw new ApiError(422, 'unprocessable entity');
    }

    await meService.updatePassword(
      req.user.sub,
      String(req.body.oldPassword),
      String(req.body.newPassword),
    );

    return res.status(204).end();
  } catch (err) {
    return next(err);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    if (
      !req.body.email ||
      !req.body.token ||
      !req.body.newPassword ||
      !req.body.newPasswordConfirm ||
      String(req.body.newPassword) !== String(req.body.newPasswordConfirm)) {
      throw new ApiError(422, 'unprocessable entity');
    }

    const session = await meService.resetPassword(
      req.body.email,
      req.body.token,
      String(req.body.newPassword),
    );

    return res.status(200).json(json.createData([{ title: 'session', data: session }]));
  } catch (err) {
    return next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    await meService.remove(req.user.sub);

    return res.status(204).end();
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  updateUserDetails,
  updatePassword,
  resetPassword,
  remove,
};
