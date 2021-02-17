/** *******REVIEW NEED TO REVIEW a bit Its great the fact it clean my code
 * So I don't have to repeat catch error async **** */

module.exports = (fn) => (req, res, next) => {
  fn(req, res, next).catch((err) => next(err));
};
