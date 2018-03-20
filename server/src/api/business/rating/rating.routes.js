const router = require('express').Router();
const ratingController = require('./rating.controller');

router.post('/:id/ratings', ratingController.create);
router.get('/:id/ratings', ratingController.findAll);

module.exports = router;
