const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  //   try {
  res.status(201).json({
    status: 'success',
    data: {
      user: newUser,
    },
  });
  //   } catch (err) {
  //     res.status(200).json({
  //       status: 'fail',
  //       message: 'Unable to create new User',
  //     });
  //   }
});
