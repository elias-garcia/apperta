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

module.exports = {
  create,
  find,
};
