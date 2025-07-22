const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');
const paginatedList = require('./paginatedList');
const read = require('./read');
const addNotes = require('./addNotes');
function modelController() {
  const methods = createCRUDController('Queries');
  methods.list = paginatedList;
  methods.read = read;
  methods["addNotes"] = addNotes;
  return methods;
}

module.exports = modelController();
