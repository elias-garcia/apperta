const nodemailer = require('nodemailer');
const appConfig = require('../config/app.config');

const transporter = nodemailer.createTransport(appConfig.mailer);

const sendPasswordResetToken = async (email, userId, token) => {
  try {
    await transporter.sendMail({
      from: 'Sender Name <sender@example.com>',
      to: email,
      subject: 'Reset password',
      text: `token: ${token}`,
      html: `<p>token: ${token}</p>`,
    });
  } catch (err) {
    throw (err);
  }
};

module.exports = {
  sendPasswordResetToken,
};
