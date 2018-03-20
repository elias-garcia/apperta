const cloudinary = require('cloudinary');
const appConfig = require('./app.config');

const configure = () => {
  cloudinary.config(appConfig.cloudinary);
};

module.exports = configure;
