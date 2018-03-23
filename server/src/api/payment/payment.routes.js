const router = require('express').Router();
const paymentController = require('./payment.controller');

router.post('/', paymentController.create);

module.exports = router;
