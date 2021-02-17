const developementError = function (err, res) {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const productionError = function (err, res) {
  // NOTE Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    // NOTE Programing or other unknow Erro: Don't send Error Details
  } else {
    // 1) console.log Err
    console.log('🕤', err);

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
    developementError(req, res, err);
  } else if (process.env.NODE_ENV === 'production') {

    productionError(req, res, err);
  }

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};
