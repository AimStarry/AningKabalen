class APIFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  filter() {
    const exclude = ['page', 'sort', 'limit', 'fields', 'search'];
    const q = Object.fromEntries(
      Object.entries(this.queryStr)
        .filter(([k]) => !exclude.includes(k))
        .map(([k, v]) => [k, typeof v === 'string' ? v.replace(/\b(gte|gt|lte|lt)\b/g, m => `$${m}`) : v])
    );
    this.query = this.query.find(JSON.parse(JSON.stringify(q)));
    return this;
  }

  search(fields) {
    if (this.queryStr.search) {
      const regex = new RegExp(this.queryStr.search, 'i');
      const conditions = fields.map(f => ({ [f]: regex }));
      this.query = this.query.find({ $or: conditions });
    }
    return this;
  }

  sort() {
    this.query = this.query.sort(
      this.queryStr.sort ? this.queryStr.sort.replace(/,/g, ' ') : '-created_at'
    );
    return this;
  }

  paginate(defaultLimit = 20) {
    const page  = parseInt(this.queryStr.page)  || 1;
    const limit = parseInt(this.queryStr.limit) || defaultLimit;
    this.query  = this.query.skip((page - 1) * limit).limit(limit);
    return this;
  }
}

module.exports = { APIFeatures };
