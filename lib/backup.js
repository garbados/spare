var PouchDB = require('pouchdb'),
    util = require('./util');

module.exports = function (remote, done) {
  var pouch = new PouchDB(util.get_db_name(remote));

  pouch.replicate.from(remote, {
    complete: done
  });
};