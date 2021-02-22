const GlobalError = require('../utils/GlobalError');

const handleCastError = (err) => {
  const message = `Invalid ${err.path} with value of ${err.value}`;
  return new GlobalError(message, 400);
};

const handleDuplicateError = (err) => {
  const message = `You already have a tour name that match ${err.keyValue.name}please use another value`;
  return new GlobalError(message, 400);
};

const handleValidatorError = (err) => {
  // const errors = Object.values(err.errors).map((el) => el.message);
  const message = `${err.message}`;
  return new GlobalError(message, 400);
};
const handleWebTokenError = (err) => {
  const message = `You have input an ${err.message}, Please login again`;
  return new GlobalError(message, 400);
};
const handleExpiredToken = () =>
  new GlobalError(
    `Your Password has expired, Please create new password to login`,
    401
  );
const developementError = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const productionError = (err, res) => {
  // NOTE Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    // NOTE Programing or other unknow Erro: Don't send Error Details
  } else {
    // 1) console.log Err
    console.error('🕤', err);

    // 2) send to client
    res.status(500).json({
      status: 'error',
      message: 'Oh oh Something went wrong',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    developementError(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = Object.assign(err);
    if (error.name === 'CastError') {
      error = handleCastError(error);
    } else if (error.name === 'MongoError') {
      error = handleDuplicateError(error);
    } else if (error.name === 'ValidationError') {
      error = handleValidatorError(error);
    } else if (err.name === 'JsonWebTokenError') {
      error = handleWebTokenError(error);
    } else if (err.name === 'TokenExpiredError') {
      error = handleExpiredToken();
    }
    productionError(error, res);
  }
};
