const catchAsync = require('../utils/catchAsync');
const GlobalError = require('../utils/GlobalError');

/** **REVIEW GETONE WHERE I CAN PASS TO ALL MY CONTROLLER */
exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;
    // NOTE always remember return
    if (!doc) {
      return next(new GlobalError(`No ${Model} find with that Id`, 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        doc,
      },
    });
  });

/** **REVIEW UPDATE MODEL WHERE I CAN PASS TO ALL MY CONTROLLER */
exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      // NOTE THIS IS HOW OUR VALIDATOR RUN AGAIN
      runValidators: true,
    });
    if (!doc) {
      return next(new GlobalError(`No ${Model} find with that Id`, 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        doc,
      },
    });
  });

/** **REVIEW DELETE MODEL WHERE I CAN PASS TO ALL MY CONTROLLER */
exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    console.log(req.params);
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new GlobalError(`No ${Model} find with that Id`, 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        doc,
      },
    });
  });

/** **REVIEW CREATE MODEL WHERE I CAN PASS TO ALL MY CONTROLLER */
exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        Model: doc,
      },
    });
  });
