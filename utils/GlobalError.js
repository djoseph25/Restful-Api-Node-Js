class GlobalError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

    // NOTE If operetion error like user not following schmema model.
    this.Operational = true;
    // NOTE Show us where our Error at;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = GlobalError;
