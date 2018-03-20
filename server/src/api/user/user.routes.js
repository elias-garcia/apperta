const router = require('express').Router();
const userController = require('./user.controller');

router.post('/', userController.create);
router.get('/:userId', userController.find);

module.exports = router;
