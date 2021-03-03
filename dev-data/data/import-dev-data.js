const mongoose = require('mongoose');
const fs = require('fs');
const dotenv = require('dotenv');
const Tour = require('../../models/tourModel');
const User = require('../../models/userModel');
const Review = require('../../models/reviewModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE;
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    // useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('Database Successful Connected');
  });

/** **SECTION Get ALL THE TOUR **** */
const allTour = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf8'));
const allUser = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf8'));
const allReview = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf8')
);

const getData = async () => {
  try {
    await Tour.create(allTour);
    await User.create(allUser, { validateBeforeSave: false });
    await Review.create(allReview);
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

/** **SECTION DELETE ALL THE TOUR in my Current Database**** */
const deleteAllTour = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
  } catch (err) {
    console.log(err);
  }
  // STOP IT FROM CONTINUING ON
  process.exit();
};

console.log(process.argv);

if (process.argv[2] === '--import') {
  getData();
} else if (process.argv[2] === '--delete') {
  deleteAllTour();
}

// node ./dev-data/data/import-dev-data.js --delete
// node ./dev-data/data/import-dev-data.js --import
