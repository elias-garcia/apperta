const ApiError = require('../api-error');
const BusinessStatus = require('./business-status.enum');
const BusinessType = require('./business-type.enum');
const Roles = require('../user/roles.enum');
const businessService = require('./business.service');
const json = require('../../util/json');
const businessDto = require('./business.dto');

const create = async (req, res, next) => {
  try {
    if (!req.body.name
      || !req.body.description
      || !req.body.phone
      || !req.body.type
      || !req.body.location
      || !req.body.location.address
      || !req.body.location.coordinates
      || (req.body.homeDeliveries === undefined)
      || !req.body.cover) {
      throw new ApiError(422, 'unprocessable entity');
    }

    const business = await businessService.create(
      req.user.sub,
      req.body.name,
      req.body.description,
      req.body.phone,
      req.body.type,
      req.body.location,
      req.body.homeDeliveries,
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
      || !req.body.description
      || !req.body.phone
      || !req.body.type
      || !req.body.location
      || !req.body.location.address
      || !req.body.location.coordinates
      || (req.body.homeDeliveries === undefined)
      || !req.body.cover) {
      throw new ApiError(422, 'unprocessable entity');
    }

    const business = await businessService.update(
      req.user.sub,
      req.params.id,
      req.body.name,
      req.body.description,
      req.body.phone,
      req.body.type,
      req.body.location,
      req.body.homeDeliveries,
      req.body.cover,
    );

    return res.json(json.createData([{ title: 'business', data: businessDto.toBusinessDto(business) }]));
  } catch (err) {
    return next(err);
  }
};

const findOne = async (req, res, next) => {
  try {
    if (!req.params.id) {
      throw new ApiError(422, 'unprocessable entity');
    }

    const business = await businessService.findOne(req.params.id);

    return res.json(json.createData([{ title: 'business', data: businessDto.toBusinessDto(business) }]));
  } catch (err) {
    return next(err);
  }
};

const findAll = async (req, res, next) => {
  try {
    if ((req.query.status && !Object.keys(BusinessStatus).includes(req.query.status))
      || (req.query.type && !Object.keys(BusinessType).includes(req.query.type))) {
      throw new ApiError(422, 'unprocessable entity');
    }

    const businesses = await businessService.findAll(
      req.query.status,
      req.query.name,
      req.query.type,
      req.query.avgRating,
    );

    return res.json(json.createData([{ title: 'businesses', data: businessDto.toBusinessesDto(businesses) }]));
  } catch (err) {
    return next(err);
  }
};

const changeStatus = async (req, res, next) => {
  try {
    if (!req.params.id
      || !Object.keys(BusinessStatus).includes(req.body.status)) {
      throw new ApiError(422, 'unprocessable entity');
    }

    if (req.user.role !== Roles.ADMIN) {
      throw new ApiError(403, 'forbidden');
    }

    const business =
      await businessService.changeStatus(req.user.sub, req.params.id, req.body.status);

    return res.json(json.createData([{ title: 'businesses', data: businessDto.toBusinessDto(business) }]));
  } catch (err) {
    return next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    if (!req.params.id) {
      throw new ApiError(422, 'unprocessable entity');
    }

    await businessService.remove(req.user.sub, req.params.id);

    return res.status(204).end();
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

    const image = await businessService.addImage(req.user.sub, req.params.id, req.body.image);

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

    await businessService.removeImage(req.user.sub, req.params.businessId, req.params.imageId);

    return res.status(204).end();
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  create,
  update,
  findOne,
  findAll,
  changeStatus,
  remove,
  addImage,
  removeImage,
};
