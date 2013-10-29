var PouchDB = require('pouchdb'),
    util = require('./util');

module.exports = function (remote, target, done) {
  var pouch = new PouchDB(target || util.get_db_name(remote));

  pouch.replicate.from(remote, {
    complete: done
  });
};