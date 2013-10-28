var PouchDB = require('pouchdb'),
    util = require('./util');

module.exports = function (remote, date, done) {
  var pouch = new PouchDB(date);

  pouch.replicate.to(remote, {
    complete: done
  });
};