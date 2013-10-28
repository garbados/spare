var PouchDB = require('pouchdb'),
    util = require('./util');

module.exports = function (remote, done) {
  var pouch = new PouchDB(util.get_db_name());

  pouch.replicate.from(remote, {
    complete: done
  });
};