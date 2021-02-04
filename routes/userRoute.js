const express = require('express');

/** ***SECTION IMPORT MY ROUTE HANDLER **** */
const userController = require('../controllers/userController');

const {
  getAllUser,
  createUser,
  singleUser,
  updateUser,
  deleteUser,
} = userController;

/** **SECTION Routing my Router Route *** */
const router = express.Router();

router.route('/').get(getAllUser).post(createUser);

router.route('/:id').get(singleUser).patch(updateUser).delete(deleteUser);

module.exports = router;
