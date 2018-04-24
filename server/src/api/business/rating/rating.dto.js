/* eslint no-underscore-dangle: 0 */
/* eslint no-param-reassign: 0 */
const dto = require('../../../util/dto');
const userDto = require('../../user/user.dto');

const toRatingDto = (doc) => {
  const ret = dto.transform(doc);

  ret.user = userDto.toUserDto(ret.user);

  return ret;
};

const toRatingsDto = docs => docs.map(doc => toRatingDto(doc));

module.exports = {
  toRatingDto,
  toRatingsDto,
};

