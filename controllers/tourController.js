// const fs = require('fs');
const Tour = require('../models/tourModel');
const ApiFeatures = require('../utils/apiFeatures');

//  SECTION import GlobalError
const GlobalError = require('../utils/GlobalError');

//  SECTION IMPORTING MY ASYNCCATCH ERROR FUNCTION
const catchAsync = require('../utils/catchAsync');

/** ****** 🙂 🙂  SECTION GET ALL TOURS 🙂 🙂 */
exports.topSevenTours = async (req, res, next) => {
  req.query.limit = 7;
  req.query.fields = 'name, price, ratingsAverage';
  req.query.sort = '-ratingsAverage';
  next();
};

exports.getAllTour = catchAsync(async (req, res, next) => {
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
});

/** ****** 💎  SECTION GET One TOURS  ♊ */
exports.getOneTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);
  // NOTE always remember return
  if (!tour) {
    return next(new GlobalError(`No tour find with that Id`, 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

/** ****** 💎  SECTION POST TOURS  ♊ */
exports.createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      tours: newTour,
    },
  });
});

/** ****** 💎  SECTION PATCH TOURS JUST A TEST  ♊ */
exports.updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    // NOTE THIS IS HOW OUR VALIDATOR RUN AGAIN
    runValidators: true,
  });
  if (!tour) {
    return next(new GlobalError(`No tour find with that Id`, 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

/** ****** 💎  SECTION DELETE TOURS Actual Delete a tour  ♊ */
exports.deleteTour = catchAsync(async (req, res, next) => {
  console.log(req.params);
  const tour = await Tour.findByIdAndDelete(req.params.id);

  if (!tour) {
    return next(new GlobalError(`No tour find with that Id`, 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});
/** *SECTION MONGOOSE AGREGARTION SIMILAR TO JS FILTER METHOD  ** */

exports.getTourStats = catchAsync(async (req, res, next) => {
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
});

/** *SECTION MONTHLY TOURS  ** */
exports.monthlyTours = catchAsync(async (req, res, next) => {
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
});
