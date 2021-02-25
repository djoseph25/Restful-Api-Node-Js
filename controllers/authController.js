// THIS IS NEEDED TO turn si fucntion can return a promise
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const GlobalError = require('../utils/GlobalError');
const sendEmail = require('../utils/email');
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
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role,
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
  // NOTE I need to select my password this way since i set it to false in my usermodel
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
/** *SECTION PROTECTED ROUTE ---Protected our get All tour ROutes */
exports.protect = catchAsync(async (req, res, next) => {
  /** NOTE THE Way this work I need to get acess to my token */
  /** NOTE we do so by passing Authorization as our key and Bearer along with a value */
  // 1) Getting check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // eslint-disable-next-line prefer-destructuring
    token = req.headers.authorization.split(' ')[1];
    // console.log(token);
  }
  if (!token) {
    return next(
      new GlobalError('You are not Login, Please login to get Access', 401)
    );
  }
  // 2) VERIFY TOKEN
  const decoded = await promisify(jwt.verify)(token, process.env.JSON_SECRET);
  // console.log(decoded);

  // 3) check if user still exist for example if the user was remove after the token was received they should not get access
  const freshUser = await User.findById(decoded.id);

  if (!freshUser) {
    return next(
      new GlobalError('The user beloging to this token no longer exist', 401)
    );
  }
  // 4)SECTION Check if user change password after token was issued
  if (freshUser.changePasswordAfter(decoded.iat)) {
    return next(
      new GlobalError(
        'The password was chage recently, please login again',
        401
      )
    );
  }
  // GRANT Acess to protected Routes
  req.user = freshUser;
  next();
});
/** SECTION RESTRICT MIDDLEWARE FOR DELETED TOUR BECAUSE I ONLY WANT ADMIN and Lead-guide* */
exports.restrictTo = (...role) => (req, res, next) => {
  // Role ['admin', 'lead-guide'].role='user'
  if (!role.includes(req.user.role)) {
    return next(
      new GlobalError(
        'You do not have access, Only Admin or lead-guide can access this route',
        403
      )
    );
  }
  next();
};

/** SECTION FORGOT PASSWORD  */
exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user by email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new GlobalError(`There is no user with that email Address`, 404)
    );
  }
  // 2) Generate reset password Token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send items to user email
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? submit a patch request with your new password passwordConfirm to : 
  ${resetUrl}.\n If you din't forget your password`;

  // Send Email
  try {
    await sendEmail({
      email: user.email,
      subject: 'Your Password reset Token (valid for 10 min)',
      message,
    });
    res.status(200).json({
      status: 'success',
      message: 'Token send to email!',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpired = undefined;
    // This acctually save the data
    await user.save({ validateBeforeSave: false });

    return new GlobalError(`There an error sending email, Try again`, 500);
  }
});

/** SECTION RESET PASSWORD  */
exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get User based on TOKEN NOTE fisrt i need to hash the token with cypto
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpired: { $gt: Date.now() },
  });
  // 2) if Token has not expired and there is a user set the new passwordResetToken
  if (!user) {
    return next(new GlobalError('Token is invalid or has expired', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpired = undefined;
  // We want to validate to we don't need validateBeforeSave: false
  await user.save();

  // 3) Update changePasswordAT property for the user

  // 4) log the user in send JWT
  const token = signInToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});
