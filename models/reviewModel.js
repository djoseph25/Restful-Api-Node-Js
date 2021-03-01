const mongoose = require('mongoose');

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
    // tour: {
    //   type: mongoose.Schema.ObjectId,
    //   ref: 'Tour',
    //   required: [true, 'Review must belong to a Tour'],
    // },
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
    path: 'tour',
    // NOTE Select: -mean not select
    select: 'name',
  });
  next();
});
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    // NOTE Select: -mean not select
    select: 'name, photo',
  });
  next();
});

const Review = mongoose.model('Review', reviewSchema);

// const testReview = new Review({
//   review: 'This is the best Tour Ever',
//   rating: 5,
// });
// // To save the documentation to the Database
// testReview
//   .save()
//   .then((doc) => {
//     console.log(doc);
//   })
//   .catch((err) => {
//     console.log('ERROR 🎢', err);
//   });

module.exports = Review;
