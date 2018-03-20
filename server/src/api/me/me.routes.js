const router = require('express').Router();
const meService = require('./me.controller');

router.put('/', meService.updateUserDetails);
router.patch('/', meService.updatePassword);
router.delete('/', meService.remove);
router.put('/password', meService.resetPassword);

module.exports = router;
