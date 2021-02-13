const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');
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

/** Whenever our app need some configuration for stuff that may change base on environment we use evironment variable  */
// console.log(process.env);
// In my terminal i need to run NODE_ENV=developement (run my server nodemon server.js)
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log('App listening 🙂 3000');
});
