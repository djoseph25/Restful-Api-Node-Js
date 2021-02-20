const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
// const fs = require('fs');

// const users = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/users.json`)
// );

exports.getAllUser = catchAsync(async (req, res) => {
  const user = await User.find();
  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Invalid Route',
  });
};
exports.singleUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Invalid Route',
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Invalid Route',
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Invalid Route',
  });
};
