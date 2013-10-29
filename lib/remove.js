var PouchDB = require('pouchdb'),
    util = require('./util');

module.exports = function (remote, target, date, done) {
  PouchDB.destroy(target || util.get_db_name(remote, date), done);
};