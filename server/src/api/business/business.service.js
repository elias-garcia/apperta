const cloudinary = require('cloudinary');
const ApiError = require('../api-error');
const Business = require('./business.model');
const User = require('../user/user.model');
const Rating = require('./rating/rating.model');

const create = async (ownerId, name, description, phone, type, location, homeDeliveries, cover) => {
  const user = await User.findById(ownerId);

  if (user.business && Object.keys(user.business)) {
    throw new ApiError(409, 'user already has a business');
  }

  let business = await Business.create({
    owner: ownerId,
    name,
    description,
    phone,
    type,
    location: {
      address: location.address,
      coordinates: location.coordinates,
    },
    homeDeliveries,
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

const update = async (userId, businessId, name, description,
  phone, type, location, homeDeliveries, cover) => {
  let business = await Business.findById(businessId);

  if (business.owner.toString() !== userId) {
    throw new ApiError(403, 'forbidden');
  }

  business.name = name;
  business.description = description;
  business.phone = phone;
  business.type = type;
  business.location.address = location.address;
  business.location.coordinates = location.coordinates;
  business.homeDeliveries = homeDeliveries;

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

const findOne = async (id) => {
  const business = await Business.findById(id);

  return business;
};

const findAll = async (status, name, type, avgRating) => {
  const query = Business.find({});

  if (status) {
    query.where({ status });
  }

  if (name) {
    query.where({ name: new RegExp(name, 'i') });
  }

  if (type) {
    query.where({ type });
  }

  let businesses = await query.sort({ isPromoted: -1 }).populate('owner', '-password');

  businesses = await Promise.all(businesses.map(async (business) => {
    const tempBusiness = business.toObject();
    const ratings = await Rating.find({ business: business.id });

    if (ratings && ratings.length) {
      const totalScore = ratings
        .map(rating => rating.score)
        .reduce((a, b) => a + b);

      tempBusiness.avgRating = totalScore / ratings.length;
    } else {
      tempBusiness.avgRating = 0;
    }

    return tempBusiness;
  }));

  if (avgRating) {
    businesses = businesses.filter(business => business.avgRating >= avgRating);
  }

  return businesses;
};

const changeStatus = async (userId, businessId, status) => {
  let business = await Business.findById(businessId);

  business.status = status;
  business = await business.save();

  return business;
};

const remove = async (userId, businessId) => {
  const business = await Business.findById(businessId);
  console.log(business);
  if (business.owner.toString() !== userId) {
    throw new ApiError(403, 'forbidden');
  }

  const user = await User.findById(userId);

  user.business = undefined;
  await user.save();
  await business.remove();
};

const addImage = async (userId, businessId, image) => {
  let business = await Business.findById(businessId);

  if (business.owner.toString() !== userId) {
    throw new ApiError(403, 'forbidden');
  }

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

const removeImage = async (userId, businessId, imageId) => {
  const business = await Business.findById(businessId);

  if (business.owner.toString() !== userId) {
    throw new ApiError(403, 'forbidden');
  }

  const imageToRemove = business.images.filter(image => image.id.toString() === imageId)[0];

  await cloudinary.uploader.destroy(imageToRemove.publicId, async () => {
    business.images = business.images.filter(image => image.id.toString() !== imageId);
    await business.save();
  });
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
