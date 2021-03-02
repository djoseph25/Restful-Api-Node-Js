const express = require('express');
/** ***SECTION IMPORT MY ROUTE HANDLER **** */
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
const reviewRouter = require('./reviewRoute');
// REVIEW CONTROLLER
// const { createReview } = reviewController;

const { protect, restrictTo } = authController;

const {
  getAllTour,
  createTour,
  getOneTour,
  updateTour,
  deleteTour,
  topSevenTours,
  getTourStats,
  monthlyTours,
} = tourController;

const router = express.Router();

/** SECTION CHEAP TOURS ROUTE * */
router.route('/top-7-Tours').get(topSevenTours, getAllTour);

/** SECTION CHEAP TOURS BY MONTH * */
router.route('/monthlyTours/:year').get(monthlyTours);

/** **SECTION TOURSTATS Route *** */
router.route('/getTourStats').get(getTourStats);

/** SECTION Creating REVIEW ROUTES* NEXTED ROUTE INSTEAD OF HAVING TO DIRECTLY PUT OUR TOUR ID */
// router
//   .route('/:tourId/reviews')
//   .post(protect, restrictTo('user'), createReview);
router.use('/:tourId/reviews', reviewRouter);

/** SECTION TOUR ROUTES  ** */
router.route('/').get(protect, getAllTour).post(createTour);
router
  .route('/:id')
  .get(getOneTour)
  .patch(updateTour)
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour);

module.exports = router;
