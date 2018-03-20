/* eslint no-underscore-dangle: 0 */
const dto = require('../../util/dto');
const userDto = require('../user/user.dto');

const toBusinessDto = (doc) => {
  const ret = dto.transform(doc);

  ret.cover = dto.transform(ret.cover);

  if (ret.images) {
    ret.images = ret.images.map(file => dto.transform(file));
  }

  return ret;
};

const toBusinessesDto = docs => docs.map((doc) => {
  const ret = toBusinessDto(doc);

  ret.owner = userDto.toUserDto(ret.owner);

  return ret;
});

const toImageDto = (doc) => {
  const ret = Object.assign({}, doc.toObject());

  ret.id = ret._id;
  delete ret._id;

  return ret;
};

module.exports = {
  toBusinessDto,
  toBusinessesDto,
  toImageDto,
};
