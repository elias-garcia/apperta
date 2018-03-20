const ApiError = require('../../api-error');
const ratingService = require('./rating.service');
const ratingDto = require('./rating.dto');
const json = require('../../../util/json');

const create = async (req, res, next) => {
  try {
    if (!req.params.id
      || !req.body.score
      || !req.body.title
      || !req.body.comment) {
      throw new ApiError(422, 'unprocessable entity');
    }

    const rating = await ratingService.create(
      req.user.sub,
      req.params.id,
      Number(req.body.score),
      req.body.title,
      req.body.comment,
    );

    return res.status(201).json(json.createData([{ title: 'rating', data: ratingDto.toRatingDto(rating) }]));
  } catch (err) {
    return next(err);
  }
};

const findAll = async (req, res, next) => {
  try {
    if (!req.params.id) {
      throw new ApiError(422, 'unprocessable entity');
    }

    const result = await ratingService.findAll(req.params.id, req.query.score);

    return res.status(200).json(json.createData([
      { title: 'ratings', data: ratingDto.toRatingsDto(result.ratings) },
      { title: 'stats', data: result.stats },
    ]));
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  create,
  findAll,
};
