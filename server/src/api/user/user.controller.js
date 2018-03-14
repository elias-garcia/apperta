const userService = require('./user.service');
const json = require('../../util/json');
const ApiError = require('../api-error');
const userDto = require('./user.dto');

const create = async (req, res, next) => {
  try {
    if (!req.body.email ||
      !req.body.password ||
      !req.body.firstName ||
      !req.body.lastName) {
      throw new ApiError(422, 'unprocessable entity');
    }

    const session = await userService.register(
      req.body.email,
      String(req.body.password),
      req.body.firstName,
      req.body.lastName,
    );

    return res.status(201).json(json.createData([{ title: 'session', data: session }]));
  } catch (err) {
    return next(err);
  }
};

const find = async (req, res, next) => {
  try {
    if (!req.params.userId) {
      throw new ApiError(422, 'unprocessable entity');
    }

    const user = await userService.findById(req.params.userId);

    return res.status(200).json(json.createData([{ title: 'user', data: userDto.toUserDto(user) }]));
  } catch (err) {
    return next(err);
  }
};

const update = async (req, res, next) => {
  try {
    if (!req.params.userId ||
      !req.body.email ||
      !req.body.firstName ||
      !req.body.lastName) {
      throw new ApiError(422, 'unprocessable entity');
    }

    if (req.user.sub !== req.params.userId) {
      throw new ApiError(403, 'you are not allowed to access this resource');
    }

    const user = await userService.update(
      req.params.userId,
      req.body.email,
      req.body.firstName,
      req.body.lastName,
    );

    return res.status(200).json(json.createData([{ title: 'user', data: userDto.toUserDto(user) }]));
  } catch (err) {
    return next(err);
  }
};

const changePassword = async (req, res, next) => {
  try {
    if (!req.params.userId ||
      !req.body.oldPassword ||
      !req.body.newPassword) {
      throw new ApiError(422, 'unprocessable entity');
    }

    if (req.user.sub !== req.params.userId) {
      throw new ApiError(403, 'you are not allowed to access this resource');
    }

    await userService.changePassword(
      req.params.userId,
      String(req.body.oldPassword),
      String(req.body.newPassword),
      req.body.token,
    );

    return res.status(204).end();
  } catch (err) {
    return next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    if (!req.params.userId) {
      throw new ApiError(422, 'unprocessable entity');
    }

    if (req.user.sub !== req.params.userId) {
      throw new ApiError(403, 'you are not allowed to access this resource');
    }

    await userService.remove(req.params.userId);

    return res.status(204).end();
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  create,
  find,
  update,
  changePassword,
  remove,
};
