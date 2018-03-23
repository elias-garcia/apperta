const Business = require('../api/business/business.model');
const jobTypes = require('./job-types.enum');

const expireToken = (jobTypes.BUSINESS_PROMOTION_EXPIRE, async (job) => {
  const business = await Business.findById(job.attrs.data.id);

  business.isPromoted = false;

  await business.save();
});

module.exports = {
  expireToken,
};
