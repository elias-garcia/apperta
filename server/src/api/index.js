const router = require('express').Router();
const sessionRoutes = require('./session/session.routes');
const passwordResetTokenRoutes = require('./password-reset-token/password-reset-token.routes');

router.use('/sessions', sessionRoutes);
router.use('/password-reset-token', passwordResetTokenRoutes);

module.exports = router;
