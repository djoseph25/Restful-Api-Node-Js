const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);
// console.log(tour);

/** ****** 🙂 🙂  SECTION GET ALL TOURS 🙂 🙂 */
exports.getAllTour = (req, res) => {
  res.status(200).json({
    Total: tours.length,
    status: 'success',
    message: 'View Tour',
    data: {
      tours,
    },
  });
};

/** ****** 💎  SECTION GET One TOURS  ♊ */
exports.getOneTour = (req, res) => {
  console.log(req.params);

  const id = req.params.id * 1;

  const tour = tours.find((el) => el.id === id);
  console.log(tour);

  /** **** ✅ ✅  CHECK TO SEE if ID DOES NOT EXIST ✅ ✅  */
  if (id > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'ID DOES NOT EXIST',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

/** ****** 💎  SECTION POST TOURS  ♊ */
exports.createTour = (req, res) => {
  // since i do not have to id with this fake db I need to this
  const newID = tours[tours.length - 1].id + 1;
  //  Obect assign allow me to combite two object
  const newTour = { id: newID, ...req.body };
  //  adding my new created tours
  const result = tours.push(newTour);
  console.log(result);

  // Adding new tours to my json files
  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tours: newTour,
        },
      });
    }
  );

  console.log(req.body);
  res.send('DONE POSTING');
};

/** ****** 💎  SECTION PATCH TOURS JUST A TEST  ♊ */
exports.updateTour = (req, res) => {
  if (parseInt(req.params.id) > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: '<updated tour here .....>',
    },
  });
};

/** ****** 💎  SECTION DELETE TOURS Actual Delete a tour  ♊ */
exports.deleteTour = (req, res) => {
  console.log(req.params);

  const id = req.params.id * 1;

  const removeTour = tours.filter((el) => el.id === id);
  const test = tours.pop(removeTour);

  /** **** ✅ ✅  CHECK TO SEE if ID DOES NOT EXIST ✅ ✅  */
  if (!tours) {
    return res.status(404).json({
      status: 'fail',
      message: 'COULD NOT DELETE THE ITEM',
    });
  }

  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tours: test,
        },
      });
    }
  );
};
