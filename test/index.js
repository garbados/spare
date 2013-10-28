var assert = require('assert'),
    request = require('request'),
    async = require('async'),
    backup = require('../lib/backup'),
    restore = require('../lib/restore'),
    remove = require('../lib/remove');

var FIXTURES = {
  remote: 'http://localhost:5984/sparetest',
  other_remote: 'http://localhost:5984/sparetest2',
  date: function () {
    var now = new Date(),
        date = [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('-');

    return date;
  },
  makeBulkDocs: function (count) {
    count = count || 100;
    var i = 0,
        docs = [];
    for (i = 0; i < count; i++) {
      docs.push({
        type: 'test'
      });
    }

    return {docs: docs};
  }
};

describe('Spare', function (){
  describe('backup', function () {
    beforeEach(function (done) {
      async.parallel([
        function (done) {
          request.put(FIXTURES.remote, done);
        },
        function (done) {
          request.put(FIXTURES.other_remote, done);
        }
      ], function (err) {
        if (err) throw err;
        request.post({
          url: FIXTURES.remote + '/_bulk_docs',
          json: FIXTURES.makeBulkDocs()
        }, function (err, res) {
          done(err, res);
        });
      });
    });

    afterEach(function (done) {
      async.parallel([
        function (done) { request.del(FIXTURES.remote, done); },
        function (done) { request.del(FIXTURES.other_remote, done); },
        function (done) { remove(FIXTURES.remote, FIXTURES.date(), done); }
      ], done);
    });

    it('should copy all remote docs to the local store', function (done) {
      async.series([
        function (done) {
          backup(FIXTURES.remote, function (err, res) {
            if (err) {
              done(err);
            } else {
              done(null, res.docs_written);
            }
          });
        },
        function (done) {
          request(FIXTURES.remote, function (err, res, body) {
            if (err) {
              done(err);
            } else {
              body = JSON.parse(body);
              done(null, body.doc_count);
            }
          });
        }
      ], function (err, results) {
        if (err) {
          console.log(err);
          throw err;
        } else {
          assert.ok(results[0] === results[1]);
          done();
        }
      });
    });

    it('should restore a local backup to a remote instance', function (done) {
      async.series([
        function (done) {
          backup(FIXTURES.remote, function (err, res) {
            if (err) {
              done(err);
            } else {
              done(null, res.docs_written);
            }
          });
        },
        function (done) {
          request.del(FIXTURES.remote, done);
        },
        function (done) {
          restore(FIXTURES.remote, FIXTURES.date(), function (err, res) {
            if (err) {
              done(err);
            } else {
              done(null, res.docs_written);
            }
          });
        },
        function (done) {
          request(FIXTURES.remote, function (err, res, body) {
            if (err) {
              done(err);
            } else {
              body = JSON.parse(body);
              done(null, body.doc_count);
            }
          });
        }
      ], function (err, results) {
        if (err) {
          console.log(err);
          throw err;
        } else {
          assert.ok(results[3] === results[2]);
          done();
        }
      });
    });
  });
  describe('restore', function () {

  });
  describe('remove', function () {

  });
  describe('watch', function () {

  });
})