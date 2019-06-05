const ApiError = require('../api-error');
const paymentService = require('./payment.service');
const json = require('../../util/json');
const dto = require('../../util/dto');
const paymentRates = require('./payment-rates');

const create = async (req, res, next) => {
  try {
    if (!req.body.token
      || req.body.paymentRate < 0
      || (req.body.paymentRate > (paymentRates.length - 1))) {
      throw new ApiError(422, 'unprocessable entity');
    }

    const payment = await paymentService.create(req.body.token, req.user.sub, req.body.paymentRate);

    return res.status(200).json(json.createData([{ title: 'payment', data: dto.transform(payment) }]));
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  create,
};
