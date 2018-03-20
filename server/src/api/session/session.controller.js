const sessionService = require('./session.service');
const ApiError = require('../api-error');
const json = require('../../util/json');
const businessDto = require('../business/business.dto');

const logIn = async (req, res, next) => {
  try {
    if (!req.body.email) {
      throw new ApiError(422, 'unprocessable entity');
    }

    const session = await sessionService.logIn(
      String(req.body.email).toLowerCase(),
      String(req.body.password),
    );

    if (session.business) {
      session.business = businessDto.toBusinessDto(session.business);
    }

    return res.status(200).json(json.createData([{ title: 'session', data: session }]));
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  logIn,
};
