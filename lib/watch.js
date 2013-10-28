var path = require('path'),
    util = require('./util'),
    backup = require('./backup'),
    cron = require('cron');

function cron (remote, done) {
  var job = new cron.cronJob('0 0 * * *', function () {
    backup(remote);
  });

  job.start();
  done();
}

module.exports = function (remote) {
  switch (process.platform){
    case 'darwin':
      // mac os x
      cron(remote, function () {
        console.log('Created cronjob.');
      });
      break;
    case 'win32':
      // windows
      throw new Error('Not Implemented :(');
    case 'linux':
      // linux, surprise surprise
      cron(remote, function () {
        console.log('Created cronjob.');
      });
      break;
  }
};