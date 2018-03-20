const expressConfig = require('./express.config');
const mongooseConfig = require('./mongoose.config');
const cloudinaryConfig = require('./cloudinary.config');

module.exports = {
  express: expressConfig,
  mongoose: mongooseConfig,
  cloudinary: cloudinaryConfig,
};
