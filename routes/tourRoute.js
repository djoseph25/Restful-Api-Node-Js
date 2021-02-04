const express = require('express');
/** ***SECTION IMPORT MY ROUTE HANDLER **** */
const tourController = require('../controllers/tourController');

const {
  getAllTour,
  createTour,
  getOneTour,
  updateTour,
  deleteTour,
} = tourController;

/** **SECTION Routing my Router Route *** */
const router = express.Router();

router.route('/').get(getAllTour).post(createTour);
router.route('/:id').get(getOneTour).patch(updateTour).delete(deleteTour);

module.exports = router;
