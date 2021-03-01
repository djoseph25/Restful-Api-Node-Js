const express = require('express');
/** ***SECTION IMPORT MY ROUTE HANDLER **** */
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const { protect, restrictTo } = authController;

const { getAllReviews, createReview } = reviewController;

const router = express.Router();

/** SECTION TOUR ROUTES  ** */
router
  .route('/')
  .get(getAllReviews)
  .post(protect, restrictTo('user'), createReview);

module.exports = router;
