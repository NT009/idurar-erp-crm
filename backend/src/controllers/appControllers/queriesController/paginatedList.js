const mongoose = require('mongoose');

const Model = mongoose.model('Queries');

const paginatedList = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.items) || 10;
  const skip = (page - 1) * limit;

  const { sortBy = 'created', sortValue = -1, filter, equal, q = '' } = req.query;

  const fieldsArray = req.query.fields ? req.query.fields.split(',') : [];
  let searchQuery = {};

  if (fieldsArray.length > 0 && q) {
    searchQuery.$or = fieldsArray.map((field) => ({
      [field]: { $regex: new RegExp(q, 'i') },
    }));
  }

  const query = {
    removed: false,
    ...(filter && equal !== undefined ? { [filter]: equal } : {}),
    ...searchQuery,
  };

  const [result, count] = await Promise.all([
    Model.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortValue, _id: 1 })
      .populate('client')
      .exec(),
    Model.countDocuments(query),
  ]);

  const pages = Math.ceil(count / limit);
  const pagination = { page, pages, count };

  if (count > 0) {
    return res.status(200).json({
      success: true,
      result,
      pagination,
      message: 'Successfully found all documents',
    });
  } else {
    return res.status(203).json({
      success: true,
      result: [],
      pagination,
      message: 'Collection is Empty',
    });
  }
};

module.exports = paginatedList;
