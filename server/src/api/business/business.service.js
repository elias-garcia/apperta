const cloudinary = require('cloudinary');
const ApiError = require('../api-error');
const Business = require('./business.model');
const User = require('../user/user.model');

const create = async (ownerId, name, phone, type, location, cover) => {
  const user = await User.findById(ownerId);

  if (user.business && Object.keys(user.business)) {
    throw new ApiError(409, 'user already has a business');
  }

  let business = await Business.create({
    owner: ownerId,
    name,
    phone,
    type,
    location: {
      coordinates: location,
    },
  });

  await cloudinary.uploader.upload(cover, async (result) => {
    business.cover = {
      publicId: result.public_id,
      url: result.secure_url,
      format: result.format,
    };

    business = await business.save();
  });

  user.business = business.id;
  await user.save();

  return business;
};

const update = async (id, name, phone, type, location, cover) => {
  let business = await Business.findById(id);

  business.name = name;
  business.phone = phone;
  business.type = type;
  business.location.coordinates = location;

  if (!cover.includes('cloudinary')) {
    await cloudinary.uploader.upload(cover, async (result) => {
      business.cover = {
        publicId: result.public_id,
        url: result.secure_url,
        format: result.format,
      };
    });
  }

  business = await business.save();

  return business;
};

const addImage = async (businessId, image) => {
  let business = await Business.findById(businessId);
  let tempImage = {};

  await cloudinary.uploader.upload(image, async (result) => {
    tempImage = {
      publicId: result.public_id,
      url: result.secure_url,
      format: result.format,
    };

    business.images.push(tempImage);

    business = await business.save();
  });

  return business.images.filter(img => img.publicId === tempImage.publicId)[0];
};

const removeImage = async (businessId, imageId) => {
  const business = await Business.findById(businessId);
  const imageToRemove = business.images.filter(image => image.id.toString() === imageId)[0];

  await cloudinary.uploader.destroy(imageToRemove.publicId, async () => {
    business.images = business.images.filter(image => image.id.toString() !== imageId);
    await business.save();
  });
};

module.exports = {
  create,
  update,
  addImage,
  removeImage,
};
