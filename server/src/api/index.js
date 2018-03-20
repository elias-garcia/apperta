const router = require('express').Router();
const sessionRoutes = require('./session/session.routes');
const userRoutes = require('./user/user.routes');
const passwordResetTokenRoutes = require('./password-reset-token/password-reset-token.routes');
const meRoutes = require('./me/me.routes');
const businessRoutes = require('./business/business.routes');

router.use('/sessions', sessionRoutes);
router.use('/users', userRoutes);
router.use('/password-reset-tokens', passwordResetTokenRoutes);
router.use('/me', meRoutes);
router.use('/businesses', businessRoutes);

module.exports = router;
