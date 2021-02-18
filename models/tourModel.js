// const validator = require('validator');
const slugify = require('slugify');
const mongoose = require('mongoose');
/** *TO CREATE A MONGOOSE MODEL WHICH CAN CREATE, READ, UPDATE, DELETE FIRST WE CREATE A SCHEMA */
/** **WE USE SCHEMA TO DESCRIBE OUR DATA,  SET DEFAULT VALUE,  VALIDATE DATA */
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour must have less than 40 character'],
      minlength: [15, 'A tour must have at least 15 characters'],
      // NOTE NPM VALIDATOR
      // validate: [validator.isAlpha, 'A tour name cannot have a number'],
    },
    slug: { type: String },
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
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty must be either easy medium or difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.7,
      min: [3, 'A tour must have a ratings lower than 1.0'],
      max: [5, 'A tour cannot have a ratings higher than 5.0'],
    },
    ratingsQuantity: {
      type: Number,
      default: 4,
    },
    price: {
      type: Number,
      required: [true, 'Price tour is Required'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator(val) {
          return val < this.price;
        },
      },
      message: 'Discount cannot be more than price',
    },

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
    // NOTE QUERY MIDDLEWARE
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// VIRTUAL PROPERTY
tourSchema.virtual('durationWeeks').get(function () {
  // NOTE calculate duration in days
  return this.duration / 7;
});

/** *SECTION MONGOOSE DOCUMENT MIDDLEWARE only run on save and create */
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

/** **SECTION MONGOOSE QUERY MIDDLEWARE */
// NOTE // /^find/ work for all the find method

tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});

// AGGREATION MIDDLEWARE to exlude secret Tour from our statsProp
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});
// CREATE A MODEL 🙋
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
