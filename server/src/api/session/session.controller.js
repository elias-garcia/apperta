const sessionService = require('./session.service');
const ApiError = require('../api-error');
const json = require('../../util/json');

const logIn = async (req, res, next) => {
  try {
    if (!req.body.email) {
      throw new ApiError(422, 'unprocessable entity');
    }

    const session = await sessionService.logIn(
      req.body.email,
      String(req.body.password),
    );

    return res.status(200).json(json.createData([{ title: 'session', data: session }]));
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  logIn,
};
