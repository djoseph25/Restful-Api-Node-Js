const express = require('express');
const morgan = require('morgan');

const GlobalError = require('./utils/GlobalError');
const errorController = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoute');
const userRouter = require('./routes/userRoute');

const app = express();

/** ****SECTION SET UP ENVIROMENT  */
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
/** *******SECTION Create Middleware ***** */
// I need this temporaty middleware to for now for my post
app.use(express.json()); //
/** ****MiddleWare for my post request */
/** ***Middleware is basically a function that can update the upcoming request data */
/** ***The data body is added to request req object */
/** ***** SECTION HOW TO SERVE UP OUR STATIC FILE IN ANOTHER WORD SERVE UP OUR HTML FILE */
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requesTime = new Date().toISOString();
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
