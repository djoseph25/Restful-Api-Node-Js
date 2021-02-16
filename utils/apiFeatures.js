class ApiFeatures {
  constructor(query, queringString) {
    this.query = query;
    this.queringString = queringString;
  }

  /** **SECTION FILTERING -- ALLOW USER USE TO FILTER BY PRICE___DURATION___DIFFiCULTLY ECT **** */
  filter() {
    const queryObj = { ...this.queringString };
    const excludedField = ['fields', 'page', 'limit', 'sort'];
    excludedField.map((field) => delete queryObj[field]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  /** *** SECTION SORT THE RESULT FROM TOP TO BOTTOM EXAMPLE PRICE__DURATION__RATINGS */
  sort() {
    if (this.queringString.sort) {
      const sortBy = this.queringString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    }
    return this;
  }

  /** SECTION FIELDS ALLOW USER TO GET ONLY CERTAIN FIELD THE CARE ABOUT LIKE ONLY GETTING BACK NAME_PRICE ECT * */
  fields() {
    if (this.queringString.fields) {
      const limitFields = this.queringString.fields.split(',').join(' ');
      this.query = this.query.select(limitFields);
    }
    return this;
  }

  /** *SECTION PAGINATION GIVE USER THE POWER TO CONTROL HOW MY TOURS THE WANT TO GET PER PAGES * */
  pagination() {
    const page = parseInt(this.queringString.page) || 1;
    const limitPerPage = parseInt(this.queringString.limit) || 50;
    const skip = (page - 1) * limitPerPage;

    this.query = this.query.skip(skip).limit(limitPerPage);
    return this;
  }
}

module.exports = ApiFeatures;
