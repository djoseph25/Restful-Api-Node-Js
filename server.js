const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

/*  SECTION HANDLE ERROR ITEM IS not defined */
// console.log(fdf)
process.on('uncaughtException', (err) => {
  console.error(err);
  // NOTE 1 Mean Error 0 mean Success
  // NOTE We closed the server using this so all curent request can be handle first istead of just process.exit(1) right away
  process.exit(1);
});

/** ***SECTION SET UP MY DOTEVN ROUTE */
dotenv.config({ path: './config.env' });
// console.log(process.env);
/** **SECTION CONNECTING TO MONGOOSE DATABASE COMPASS** * */
const DB = process.env.DATABASE;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    autoIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('DB Connection Successful');
  });
//  // Handle process.ev error locally
// .catch((err) => {
//   console.log(err);
// });

/** Whenever our app need some configuration for stuff that may change base on environment we use evironment variable  */
// console.log(process.env);
// In my terminal i need to run NODE_ENV=developement (run my server nodemon server.js)
const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log('App listening 🙂 3000');
});

/*  SECTION HANDLE PROCESS.ENV ERROR 🍎🍎 Globably 🍎🍎 EXAMPLE bad password */
process.on('unhadleRejection', (err) => {
  console.error(err);
  // NOTE 1 Mean Error 0 mean Success
  // NOTE We closed the server using this so all curent request can be handle first istead of just process.exit(1) right away
  server.close(() => {
    process.exit(1);
  });
});

/*  SECTION HANDLE ERROR ITEM IS not defined */
// console.log(fdf)
process.on('uncaughtException', (err) => {
  console.error(err);
  // NOTE 1 Mean Error 0 mean Success
  // NOTE We closed the server using this so all curent request can be handle first istead of just process.exit(1) right away
  process.exit(1);
});
