// const validator = require('validator');
const slugify = require('slugify');
const mongoose = require('mongoose');

// const User = require('./userModel');
/** *TO CREATE A MONGOOSE MODEL WHICH CAN CREATE, READ, UPDATE, DELETE FIRST WE CREATE A SCHEMA */
/** **WE USE SCHEMA TO DESCRIBE OUR DATA,  SET DEFAULT VALUE,  VALIDATE DATA */
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [70, 'A tour must have less than 40 character'],
      minlength: [5, 'A tour must have at least 15 characters'],
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
    // EMBEDDED DATA TOP
    startLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    // EMBEDDED DATA
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          emum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    // guides: Array,
    guides: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
    // reviews: [{ type: mongoose.Schema.ObjectId, ref: 'UserReview' }],
  },

  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
// REVIEW ADDING OUR MONGOOSE INDEX TO IMPROVE READING SPEED WHEN IT COME TO FILTERING THOUGH OUR TOURS
// LET SAY WE WANT TO FILTER BY PRICE WE DON"T Want to filter though all becuase it will decrease speed of our application"
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
/** *SECTION Pre middleware run before we query our field */
// NOTE // /^find/ work for all the find method

// 1) 🙋 This pre Middleware populate our guide array, Which simply mean fill up the data that match that query ID
tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    // NOTE Select: -mean not select
    select: '-__v -passwordChangedAt',
  });
  next();
});

// 2) 👓 This Pre-Middleware return all the tour who secret has not been set to True
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});

// 3) 👓  AGGREATION MIDDLEWARE to exlude secret Tour from our statsProp 👓
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

// 4) 🥳  This Pre-middleware slugify the name and retrun the lower case
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// 35) Virtuals are additional fields for a given model. They do not get save in our database
tourSchema.virtual('durationWeeks').get(function () {
  // NOTE calculate duration in days
  return this.duration / 7;
});

// 5)SECTION Virtual Property to get my User reviewS
// NOTE reviews name our schema ref: to what we want to populate
// NOTE foreignField refers to tour in our schema and localField link with _ID
tourSchema.virtual('reviews', {
  ref: 'Review',
  // NOTE refecenece to the curent model you want to polpulate
  foreignField: 'tour',
  localField: '_id',
});
// CREATE A MODEL 🙋
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
