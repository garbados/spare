/* Who watches the watchers? Well, a watcher, of course!
 *
 * Replicates the remote to a local 'watcher' db.
 * On a daily basis, cancels that continuous replication
 * and replicates to the target.
 * Once that's done, resumes continuous replication.
 */

var cron = require('cron'),
    PouchDB = require('pouchdb'),
    util = require('./util'),
    url = require('url');

module.exports = function watch (remote, target) {
  var remote_parts = url.parse(remote),
      local_target = util.get_db_name(remote, 'watcher'),
      pouch = new PouchDB(local_target),
      job = replicate(remote);

  target = target || util.get_db_name(remote);

  function replicate (remote) {
    return pouch.replicate.from(remote, {
      continuous: true
    }); 
  }

  function save (target, done) {
    return pouch.replicate.to(target, {
      complete: done
    });
  }

  function stop_job (done) {
    job.cancel();
    done();
  }

  return function (done) {
    // cancel the continuous replication
    stop_job(function () {
      // save to the target
      save(target, function (err, res) {
        // continue the continuous replication
        job = replicate(remote);
        // then, handle errors and callbacks
        if (done) {
          done(err, res);
        } else {
          if (err) throw err;
          console.log('Saved to', remote_parts.host + remote_parts.pathname);
        }
      });
    });
  };
};