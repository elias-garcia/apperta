const nodemailer = require('nodemailer');
const appConfig = require('../config/app.config');

const transporter = nodemailer.createTransport(appConfig.mailer);

const sendPasswordResetToken = async (email, token) => {
  try {
    await transporter.sendMail({
      from: 'Apperta <info@apperta.me>',
      to: email,
      subject: 'Reestablecer contraseña',
      text: `Código para reestablecer la contraseña: ${token}`,
      html: `<p>Código para reestablecer la contraseña: ${token}</p>`,
    });
  } catch (err) {
    throw (err);
  }
};

const sendUserActivationToken = async (email, token) => {
  try {
    await transporter.sendMail({
      from: 'Apperta <info@apperta.me>',
      to: email,
      subject: 'Confirmación de email',
      text: `Código para confirmar el email: ${token}`,
      html: `<p>Código para confirmar el email: ${token}</p>`,
    });
  } catch (err) {
    throw (err);
  }
};

module.exports = {
  sendPasswordResetToken,
  sendUserActivationToken,
};
