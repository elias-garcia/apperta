const appConfig = require('../../config/app.config');
const stripe = require('stripe')(appConfig.stripe.sk);
const moment = require('moment');
const User = require('../user/user.model');
const Business = require('../business/business.model');
const Payment = require('./payment.model');
const scheduler = require('../../util/scheduler');
const jobTypes = require('../../jobs/job-types.enum');
const ApiError = require('../api-error');

const create = async (token, userId) => {
  const user = await User.findById(userId);
  const business = await Business.findById(user.business);

  const charge = await stripe.charges.create({
    amount: appConfig.promotionCost,
    currency: 'eur',
    description: 'Promoción del local',
    source: token,
  });

  if (!charge) {
    throw new ApiError(500, 'internal server error');
  }

  const validUntilDate = moment().add(
    appConfig.promotionDurationTime,
    appConfig.promotionDurationUnit,
  );

  business.isPromoted = true;
  await business.save();

  const payment = await Payment.create({
    stripeId: charge.id,
    user: user.id,
    business: user.business,
    validUntil: validUntilDate.toISOString(),
  });

  scheduler.schedule(
    validUntilDate.toDate(),
    jobTypes.BUSINESS_PROMOTION_EXPIRE,
    { id: business.id },
  );

  return payment;
};

module.exports = {
  create,
};
