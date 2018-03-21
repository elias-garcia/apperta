const router = require('express').Router();
const businessController = require('./business.controller');

router.post('/', businessController.create);
router.get('/', businessController.findAll);
router.get('/:id', businessController.findOne);
router.put('/:id', businessController.update);
router.patch('/:id', businessController.changeStatus);
router.delete('/:id', businessController.remove);
router.post('/:id/images', businessController.addImage);
router.delete('/:businessId/images/:imageId', businessController.removeImage);

module.exports = router;
