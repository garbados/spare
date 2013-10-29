var PouchDB = require('pouchdb'),
    util = require('./util');

module.exports = function (remote, target, date, done) {
  var pouch = new PouchDB(target || util.get_db_name(remote, date));

  pouch.replicate.to(remote, {
    complete: done
  });
};