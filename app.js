const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xxs = require('xss-clean');
const hpp = require('hpp');

const GlobalError = require('./utils/GlobalError');
const errorController = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoute');
const userRouter = require('./routes/userRoute');
const userReview = require('./routes/reviewRoute');

const app = express();
/** REVIEW Set is up pug view engine */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

/** ***** SECTION HOW TO SERVE UP OUR STATIC FILE IN ANOTHER WORD SERVE UP OUR HTML FILE */
app.use(express.static('public'));
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/js', express.static(path.join(__dirname, 'public/js')));
app.use('/img', express.static(path.join(__dirname, 'public/img')));

/* REVIEW RENDER FILE */
app.get('/', (req, res, next) => {
  res.status(200).render('home', {
    tour: 'A whole ne World',
    user: 'David Joseph',
  });
});
app.get('/allTours', (req, res, next) => {
  res.send('This is the Tour Page');
});
app.get('/about', (req, res, next) => {
  res.send('This is the About Pages');
});
app.get('/news', (req, res, next) => {
  res.send('This is the News Page');
});
app.get('/contact', (req, res, next) => {
  res.send('This is the News Page');
});
// 🙋 🥳 🙋 🥳 🙋 🥳 🙋 🥳 🙋 🥳 🙋 🥳 🙋 🥳

/** SECTION Set security HTTP headers */
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

/** *******SECTION Create Middleware ***** */
app.use(express.json({ limit: '10kb' })); //

// DATA SANITAZATION against NOSQL query Injection
app.use(mongoSanitize());
// DATA SANITiZATION Against XSS
app.use(xxs());

// protect against HTTP Parameter Pollution attacks
// duration is allowed multiple field duration
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficult',
      'price',
    ],
  })
);

app.use((req, res, next) => {
  req.requesTime = new Date().toISOString();
  // console.log(req.headers)
  next();
});

// ROUTE//
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', userReview);

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
