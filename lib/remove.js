var PouchDB = require('pouchdb'),
    util = require('./util');

module.exports = function (remote, date, done) {
  PouchDB.destroy(util.get_db_name(remote, date), done);
};