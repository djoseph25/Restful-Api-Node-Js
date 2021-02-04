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
    useFindAndModify: false,
  })
  .then(() => {
    console.log('DB Connection Successful');
  });

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
  },
});

const Tour = mongoose.model('Tour', tourSchema);

const testTour = new Tour({
  name: 'THE FOREST RANGER',
  rating: 4.7,
  price: 456,
});
testTour
  .save()
  .then((doc) => {
    console.log(doc);
  })
  .catch((err) => {
    console.log(err, 'ERROR SOMETHING WRONG');
  });
/** Whenever our app need some configuration for stuff that may change base on environment we use evironment variable  */
// console.log(process.env);
// In my terminal i need to run NODE_ENV=developement (run my server nodemon server.js)
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log('App listening 🙂 3000');
});
