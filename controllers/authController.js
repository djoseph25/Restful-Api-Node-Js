const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const GlobalError = require('../utils/GlobalError');
// TOKENS
const signInToken = (id) =>
  jwt.sign({ id }, process.env.JSON_SECRET, {
    expiresIn: process.env.JSON_EXPIRES_IN,
  });

exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  /** **SECTION SECURITY USING JSON WEB TOKEN */
  const token = signInToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

/**  💎  SECTION LOGIN IN USER IF PASSWORD AND EMAIL EXIST ** */

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // 1) Check if Email and Password exist
  if (!email || !password) {
    return next(new GlobalError('An Email and password is Required', 400));
  }
  // 2) Check if user existand password is correct
  // NOTE I need to selct my password this way since i set it to false in my usermodel
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new GlobalError('User Email or Password are incorrect', 401));
  }

  // 3) Check to see if everything ok before we token to client
  const token = signInToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});
