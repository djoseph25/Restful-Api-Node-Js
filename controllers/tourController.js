// const fs = require('fs');
const Tour = require('../models/tourModel');

/** ****** 🙂 🙂  SECTION GET ALL TOURS 🙂 🙂 */
exports.getAllTour = async (req, res) => {
  try {
    const tours = await Tour.find();
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
