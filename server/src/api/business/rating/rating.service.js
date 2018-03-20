const Rating = require('./rating.model');
const Business = require('../business.model');
const ApiError = require('../../api-error');

const create = async (userId, businessId, score, title, comment) => {
  const business = await Business.findById(businessId);

  if (!business) {
    throw ApiError(404, 'user not found');
  }

  if (business.owner.id.toString === userId) {
    throw ApiError(403, 'forbidden');
  }

  const rating = await Rating.create({
    user: userId,
    business: business.id,
    title,
    score,
    comment,
  });

  await rating.populate('user').execPopulate();

  return rating;
};

const findAll = async (businessId, score) => {
  const query = Rating.find({ business: businessId });

  if (score) {
    query.where('score').equals(score);
  }

  const ratings = await query
    .populate('user');

  const stats = {};

  stats.totalCount = await query.count();

  if (!score) {
    const scores = [1, 2, 3, 4, 5];
    const allRatings = await Rating.find({ business: businessId });
    let allRatingsSum = 0;

    if (allRatings.length) {
      allRatingsSum = allRatings
        .map(rating => rating.score)
        .reduce((a, b) => a + b);
    }

    if (allRatingsSum !== 0) {
      stats.averageRating = Number((allRatingsSum / allRatings.length).toFixed(1));
    } else {
      stats.averageRating = 0;
    }

    stats.scoresCount = [];

    await Promise.all(scores.map(async (value) => {
      const count = await Rating.count({ business: businessId, score: value });

      stats.scoresCount.push({ score: value, count });
    }));

    stats.scoresCount = stats.scoresCount.sort((a, b) => a.score - b.score);
  }

  return { ratings, stats };
};

module.exports = {
  create,
  findAll,
};
