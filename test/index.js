var assert = require('assert'),
    request = require('request'),
    async = require('async'),
    backup = require('../lib/backup'),
    restore = require('../lib/restore'),
    remove = require('../lib/remove'),
    watch = require('../lib/watch');

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
        function (done) { remove(FIXTURES.remote, null, FIXTURES.date(), function (err, res) {
          if (err) {
            if (err.status === 404) {
              done();
            } else {
              console.log(err);
              throw err;
            }
          } else {
            done();
          }
        }); }
      ], done);
    });

    it('should copy all remote docs to the local store', function (done) {
      async.series([
        function (done) {
          backup(FIXTURES.remote, null, function (err, res) {
            if (err) {
              done(err);
            } else {
              done(null, res.docs_written);
            }
          });
        },
        function (done) {
          request(FIXTURES.remote, null, function (err, res, body) {
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
          backup(FIXTURES.remote, null, function (err, res) {
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
          restore(FIXTURES.remote, null, FIXTURES.date(), function (err, res) {
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

    it('should backup remote to a given target', function (done) {
      this.timeout(3000);
      async.series([
        function (done) {
          backup(FIXTURES.remote, FIXTURES.other_remote, function (err, res) {
            if (err) {
              done(err);
            } else {
              done(null, res.docs_written); 
            }
          }); 
        },
        function (done) {
          request(FIXTURES.other_remote, function (err, res, body) {
            if (err) {
              done(err);
            } else {
              body = JSON.parse(body);
              done(null, body.doc_count);
            }
          });
        },
      ], function (err, results) {
        if (err) {
          done(err);
        } else {
          assert.ok(results[0] === results[1]);
          done(); 
        }
      });
    });

    it('should watch a given remote', function (done) {
      async.series([
        function (done) {
          watch(FIXTURES.remote, FIXTURES.other_remote)(function (err, res) {
            if (err) {
              done(err);
            } else {
              done(null, res.docs_written); 
            }
          }); 
        },
        function (done) {
          request(FIXTURES.other_remote, function (err, res, body) {
            if (err) {
              done(err);
            } else {
              body = JSON.parse(body);
              done(null, body.doc_count);
            }
          });
        },
      ], function (err, results) {
        if (err) {
          done(err);
        } else {
          assert.ok(results[0] === results[1]);
          done(); 
        }
      });
    });
  });
});