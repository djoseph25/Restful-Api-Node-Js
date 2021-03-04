const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'A review is Required'],
    },
    rating: {
      type: Number,
      required: [true, 'A rating is Required'],
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date().toLocaleString().split(',')[0],
    },
    // PAREBNT REFERENING
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a Tour'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to User'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    // NOTE Select: -mean not select
    select: 'name photo',
  });
  next();
});

// REVIEW CALCULATE total  🙂 ratingsAverage 🥛 ratingsQuantity
reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  // SToring the data into our Tour MOdel
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

reviewSchema.post('save', function () {
  // NOTE this points to current review
  this.constructor.calcAverageRatings(this.tour);
});

// findByIdAndUpdate
// findByIdAndDelete
reviewSchema.pre('/^findOneAnd/', async function (next) {
  this.review = await this.findOne();
  next();
});
// NOTE Pass our pre middleware to this post middleware
reviewSchema.post('/^findOneAnd/', async function () {
  // Await this,findOne(); 🌟 Does not wirk here because it's already been declared
  await this.review.constructor.calcAverageRatings(this.review.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
