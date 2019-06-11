module.exports = {
  port: process.env.PORT || 3000,
  mongo: process.env.MONGO_URI || 'mongodb://localhost:27017/apertapp',
  path: '/api',
  jwtSecret: process.env.JWT_SECRET || 'sporter-jwt-secret',
  jwtMaxAge: '7d', // One week
  passwordResetTokenExpiration: 3600, // One hour in seconds
  mailer: {
    host: process.env.MAILER_HOST || '',
    port: process.env.MAILER_PORT || 587,
    auth: {
      user: process.env.MAILER_USER || '',
      pass: process.env.MAILER_PASSWORD || '',
    },
    secure: true,
    tls: {
      rejectUnauthorized: false,
    },
  },
  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
    api_key: process.env.CLOUDINARY_API_KEY || '',
    api_secret: process.env.CLOUDINARY_API_SECRET || '',
  },
  stripe: {
    pk: process.env.STRIPE_PK || '',
    sk: process.env.STRIPE_SK || '',
  }
};