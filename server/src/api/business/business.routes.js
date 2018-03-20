const router = require('express').Router();
const businessController = require('./business.controller');

router.post('/', businessController.create);
router.put('/:id', businessController.update);
router.post('/:id/images', businessController.addImage);
router.delete('/:businessId/images/:imageId', businessController.removeImage);

module.exports = router;
