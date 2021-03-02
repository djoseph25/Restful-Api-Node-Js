const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  const review = await Review.find();
  res.status(200).json({
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
