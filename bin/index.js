#!/usr/bin/env node

var pkg = require('../package.json'),
    program = require('commander');

program
  .version(pkg.version)
  .usage('[action] [options]')
  .option('-v, --verbose', 'Enable verbose logging.')
  .option('-r, --remote <url>', 'CouchDB / Cloudant instance to backup or restore.')
  .option('-t, --target [url]', 'CouchDB / Cloudant instance to backup into.')
  .option('-d, --date <YYYY-MM-DD>', 'Backup date to restore');

program
  .command('backup')
  .description('Do a one-off backup of a remote CouchDB / Cloudant instance.')
  .action(function () {
    var backup = require('../lib/backup');
    backup(program.remote, program.target, function (err, res) {
      if (err) throw err;
      console.log('Backup complete! Wrote', res.docs_written, 'documents.');
    });
  });

program
  .command('restore')
  .description('Restore a remote from a backup.')
  .action(function () {
    var restore = require('../lib/restore');
    restore(program.remote, program.target, program.date, function (err, res) {
      if (err) throw err;
      console.log('Restore complete! Wrote', res.docs_written, 'documents.');
    });
  });

program
  .command('remove')
  .description('Delete a remote\'s backup of a particular day')
  .action(function () {
    var remove = require('../lib/remove');
    remove(program.remote, program.target, program.date, function (err, res) {
      if (err) {
        if (err.status === 404) console.log('DB not found, did not delete.');
        else throw err;
      } else {
        console.log('Removal complete!'); 
      }
    });
  });

// start!
program
  .parse(process.argv);