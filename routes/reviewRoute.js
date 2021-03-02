const express = require('express');
/** ***SECTION IMPORT MY ROUTE HANDLER **** */
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const { protect, restrictTo } = authController;

const {
  getAllReviews,
  createReview,
  deleteReview,
  updateReview,
  getOneReview,
} = reviewController;

// NOTE MergeParams as long as we get post route it will will all get redirected to our post route from reviews
const router = express.Router({ mergeParams: true });
// POST/tourID/USERID/reviews
// POST/reviews

/** SECTION TOUR ROUTES  ** */
router
  .route('/')
  .get(getAllReviews)
  .post(protect, restrictTo('user'), createReview);

router.route('/:id').get(getOneReview).patch(updateReview).delete(deleteReview);

module.exports = router;
