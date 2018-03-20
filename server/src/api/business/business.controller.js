const ApiError = require('../api-error');
const businessService = require('./business.service');
const json = require('../../util/json');
const businessDto = require('./business.dto');

const create = async (req, res, next) => {
  try {
    if (!req.body.name
      || !req.body.phone
      || !req.body.type
      || !req.body.location
      || !req.body.cover) {
      throw new ApiError(422, 'unprocessable entity');
    }

    const business = await businessService.create(
      req.user.sub,
      req.body.name,
      req.body.phone,
      req.body.type,
      req.body.location,
      req.body.cover,
    );

    return res.json(json.createData([{ title: 'business', data: businessDto.toBusinessDto(business) }]));
  } catch (err) {
    return next(err);
  }
};

const update = async (req, res, next) => {
  try {
    if (!req.params.id
      || !req.body.name
      || !req.body.phone
      || !req.body.type
      || !req.body.location
      || !req.body.cover) {
      throw new ApiError(422, 'unprocessable entity');
    }

    const business = await businessService.update(
      req.params.id,
      req.body.name,
      req.body.phone,
      req.body.type,
      req.body.location,
      req.body.cover,
    );

    return res.json(json.createData([{ title: 'business', data: businessDto.toBusinessDto(business) }]));
  } catch (err) {
    return next(err);
  }
};

const addImage = async (req, res, next) => {
  try {
    if (!req.params.id
      || !req.body.image) {
      throw new ApiError(422, 'unprocessable entity');
    }

    const image = await businessService.addImage(req.params.id, req.body.image);

    return res.json(json.createData([{ title: 'image', data: businessDto.toImageDto(image) }]));
  } catch (err) {
    return next(err);
  }
};

const removeImage = async (req, res, next) => {
  try {
    if (!req.params.businessId
      || !req.params.imageId) {
      throw new ApiError(422, 'unprocessable entity');
    }

    await businessService.removeImage(req.params.businessId, req.params.imageId);

    return res.status(204).end();
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  create,
  update,
  addImage,
  removeImage,
};
