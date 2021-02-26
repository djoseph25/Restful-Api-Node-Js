const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
cost xxs = require('xss-clean');

const GlobalError = require('./utils/GlobalError');
const errorController = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoute');
const userRouter = require('./routes/userRoute');

const app = express();
// Set security HTTP headers
app.use(helmet());
/** ****SECTION SET UP ENVIROMENT  */
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// SECTION Setting Rate limiter : aLLOWING 100 REQUEST per Hour from the Same IP Address
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too Many request from this IP, please try again in an hour',
});
app.use('/api', limiter);

// BODY PARSER, READIND data body into req.body
/** *******SECTION Create Middleware ***** */
// I need this temporaty middleware to for now for my post
// Limit file to 10kb
app.use(express.json({ limit: '10kb' })); //

// DATA SANITAZATION against NOSQL query Injection
app.use(mongoSanitize());
// DATA SANITiZATION Against XSS
app.use(xxs())

/** ***** SECTION HOW TO SERVE UP OUR STATIC FILE IN ANOTHER WORD SERVE UP OUR HTML FILE */
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requesTime = new Date().toISOString();
  // console.log(req.headers)
  next();
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

/** ** SECTION HANDLE ALL UNDEFINED ROUTE for GET, POST, DELETE PATH ECT */
app.all('*', (req, res, next) => {
  next(
    new GlobalError(
      `Cannot find route at ${req.originalUrl} on this server`,
      404
    )
  );
});

/** ***SECTION GLOABAL ERROR HANDLER ROUTE ** */
app.use(errorController);

/** ****** 🖥   SECTION SERVER 🧭  */
module.exports = app;
