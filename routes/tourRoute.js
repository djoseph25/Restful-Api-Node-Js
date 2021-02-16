const express = require('express');
/** ***SECTION IMPORT MY ROUTE HANDLER **** */
const tourController = require('../controllers/tourController');

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

/** SECTION TOUR ROUTES  ** */
router.route('/').get(getAllTour).post(createTour);
router.route('/:id').get(getOneTour).patch(updateTour).delete(deleteTour);

module.exports = router;
