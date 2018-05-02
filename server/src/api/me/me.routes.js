const router = require('express').Router();
const meController = require('./me.controller');

router.put('/', meController.updateUserDetails);
router.patch('/', meController.updatePassword);
router.delete('/', meController.remove);
router.put('/password', meController.resetPassword);
router.post('/activation', meController.activateUser);

module.exports = router;
