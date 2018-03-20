const mongoose = require('mongoose');
const BusinessType = require('./business-type.enum');
const BusinessStatus = require('./business-status.enum');

const fileSchema = new mongoose.Schema({
  publicId: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  format: {
    type: String,
    required: true,
  },
});

const businessSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  location: {
    type: { type: String, default: 'Point', required: true },
    address: { type: String, required: true },
    coordinates: { type: [Number], required: true },
  },
  type: {
    type: String,
    enum: Object.keys(BusinessType).map(key => BusinessType[key]),
    required: true,
  },
  status: {
    type: String,
    enum: Object.keys(BusinessStatus).map(key => BusinessStatus[key]),
    default: BusinessStatus.PENDING,
    required: true,
  },
  isPromoted: {
    type: Boolean,
    required: true,
    default: false,
  },
  cover: {
    type: fileSchema,
    required: false,
  },
  images: {
    type: [fileSchema],
    required: false,
  },
});

const Business = mongoose.model('Business', businessSchema);

module.exports = Business;
