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

/** SECTION TOUR ROUTES  ** */
router.use(protect);
router.route('/').get(getAllReviews).post(restrictTo('user'), createReview);

// NOTE ONLY AMDIN AND USER CAN UPDATE DELETE TOUR NOT OUR GUIDE
router
  .route('/:id')
  .get(getOneReview)
  .patch(restrictTo('user', 'admin'), updateReview)
  .delete(restrictTo('user', 'admin'), deleteReview);

module.exports = router;
