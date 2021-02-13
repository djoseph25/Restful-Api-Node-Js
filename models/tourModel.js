const mongoose = require('mongoose');
/** *TO CREATE A MONGOOSE MODEL WHICH CAN CREATE, READ, UPDATE, DELETE FIRST WE CREATE A SCHEMA */
/** **WE USE SCHEMA TO DESCRIBE OUR DATA,  SET DEFAULT VALUE,  VALIDATE DATA */
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
  },
  duration: {
    type: Number,
    required: [true, 'A tour duration is required'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A max goup size is required'],
  },
  difficulty: {
    type: String,
    required: [true, 'A tour difficulty is required'],
  },
  ratingsAverage: {
    type: Number,
    default: 4.7,
  },
  ratingsQuantity: {
    type: Number,
    default: 4,
  },
  price: {
    type: Number,
    required: [true, 'Price tour is Required'],
  },
  priceDiscount: Number,

  summary: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'A tour must have a description'],
  },
  imageCover: {
    type: String,
    required: [true, 'A tour must have an image Cover'],
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date().toLocaleString().split(',')[0],
  },
  startDates: [Date],
});
// CREATE A MODEL 🙋
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
