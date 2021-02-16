// const fs = require('fs');
const Tour = require('../models/tourModel');
const ApiFeatures = require('../utils/apiFeatures');

/** ****** 🙂 🙂  SECTION GET ALL TOURS 🙂 🙂 */
exports.topSevenTours = async (req, res, next) => {
  req.query.limit = 7;
  req.query.fields = 'name, price, ratingsAverage';
  req.query.sort = '-ratingsAverage';
  next();
};

exports.getAllTour = async (req, res) => {
  try {
    const apiShortcut = new ApiFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .fields()
      .pagination();

    const tours = await apiShortcut.query;
    res.status(200).json({
      status: 'success',
      Total: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: '💟  Error 🚻 ',
    });
  }
};

/** ****** 💎  SECTION GET One TOURS  ♊ */
exports.getOneTour = async (req, res) => {
  console.log(req.params);
  try {
    const singleTour = await Tour.findOne(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        singleTour,
      },
    });
  } catch (err) {
    console.log('Unable to retrieve single tour');
  }
};

/** ****** 💎  SECTION POST TOURS  ♊ */
exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tours: newTour,
      },
    });
  } catch (err) {
    console.log(err);
  }
};

/** ****** 💎  SECTION PATCH TOURS JUST A TEST  ♊ */
exports.updateTour = async (req, res) => {
  try {
    const updateTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      // NOTE THIS IS HOW OUR VALIDATOR RUN AGAIN
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        updateTour,
      },
    });
  } catch (err) {
    console.log('Unable to updateTour');
  }
};

/** ****** 💎  SECTION DELETE TOURS Actual Delete a tour  ♊ */
exports.deleteTour = async (req, res) => {
  console.log(req.params);
  try {
    const deletedTour = await Tour.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        deletedTour,
      },
    });
  } catch (err) {
    console.log('Error unable to delete');
  }
};
/** *SECTION MONGOOSE AGREGARTION SIMILAR TO JS FILTER METHOD  ** */

exports.getTourStats = async (req, res, next) => {
  try {
    const tourStats = await Tour.aggregate([
      { $match: { ratingsAverage: { $gte: 4.5 } } },
      {
        $group: {
          /** *NOTE --toUpper mean upperCase */
          _id: { $toUpper: '$difficulty' },
          numTours: { $sum: 1 },
          numRating: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      { $sort: { avgPrice: -1 } },
    ]);
    res.status(200).json({
      status: 'success',
      data: tourStats,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: 'Not able to get tour stats',
    });
  }
};
exports.monthlyTours = async (req, res) => {
  try {
    const year = req.params.year * 1;
    const plan = await Tour.aggregate([
      { $unwind: '$startDates' },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          numTourStart: { $sum: 1 },
          tours: { $push: '$name' },
        },
      },
      /** ** NOTE Add fields *** */
      {
        $addFields: { month: '$_id' },
      },
      /** ** NOTE HAD TO PUT 0 to remove ID from being show*** */
      {
        $project: { _id: 0 },
      },
      {
        $sort: { numTourStart: -1 },
      },
      { $limit: 12 },
    ]);
    res.status(200).json({
      status: 'success',
      data: {
        plan,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: 'Unable',
    });
  }
};
