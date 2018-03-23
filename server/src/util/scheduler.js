const Agenda = require('agenda');
const appConfig = require('../config/app.config');
const jobTypes = require('../jobs/job-types.enum');
const jobs = require('../jobs/index');

const agenda = new Agenda({ db: { address: appConfig.mongo } });

agenda.on('ready', () => {
  agenda.define(
    jobTypes.PASSWORD_RESET_TOKEN_EXPIRE,
    jobs.passwordResetTokenJobs.passwordResetTokenJob,
  );
  agenda.define(
    jobTypes.BUSINESS_PROMOTION_EXPIRE,
    jobs.businessJobs.expireToken,
  );
  agenda.start();
});

agenda.on('error', () => {
  process.exit(0);
});

module.exports = agenda;
