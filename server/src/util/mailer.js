const nodemailer = require('nodemailer');
const appConfig = require('../config/app.config');

const transporter = nodemailer.createTransport(appConfig.mailer);

const sendPasswordResetToken = async (email, token) => {
  try {
    await transporter.sendMail({
      from: 'Sender Name <sender@example.com>',
      to: email,
      subject: 'Apperta - Reestablecer contraseña',
      text: `Código para reestablecer la contraseña: ${token}`,
      html: `<p>Código para reestablecer la contraseña: ${token}</p>`,
    });
  } catch (err) {
    throw (err);
  }
};

module.exports = {
  sendPasswordResetToken,
};
