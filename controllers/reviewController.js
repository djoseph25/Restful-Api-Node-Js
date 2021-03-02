const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./CRUDcontroller');

const { deleteOne, updateOne, getOne } = factory;

exports.getAllReviews = catchAsync(async (req, res, next) => {
  //  /** REVIEW IF There a TOUR ID */ /* THEN WE WANT TO filter only review for that Tour ID */
  let filter = {};
  if (req.params.tourId) {
    filter = { tour: req.params.tourId };
  }
  const review = await Review.find(filter);
  res.status(200).json({
    result: review.length,
    status: 'success',
    data: {
      review,
    },
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  /** REVIEW IF WE DONT SPECIFY TOUR ID */ /* THEN WE WANT TO USE THE USE FROM OUR URL */
  if (!req.body.tour) req.body.tour = req.params.tourId;
  // WE GET USER.body From out protect middleware we passing in to our tour route
  if (!req.body.user) req.body.user = req.user.id;

  const newReview = await Review.create(req.body);
  res.status(200).json({
    status: 'success',
    data: {
      Review: newReview,
    },
  });
});

/** *SECTION GetOne Review Using our NEW CRUD CONTROLLER */
exports.getOneReview = getOne(Review);

/** *SECTION DELETe Review Using our NEW CRUD CONTROLLER */
exports.deleteReview = deleteOne(Review);

/** *SECTION UPDATE Review Using our NEW CRUD CONTROLLER */
exports.updateReview = updateOne(Review);
