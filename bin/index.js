#!/usr/bin/env node

var pkg = require('../package.json'),
    program = require('commander');

program
  .version(pkg.version)
  .usage('[action] [options]')
  .option('-v, --verbose', 'Enable verbose logging.')
  .option('-r, --remote <url>', 'CouchDB / Cloudant instance to backup or restore.')
  .option('-d, --date <YYYY-MM-DD>', 'Backup date to restore');

program
  .command('backup')
  .description('Do a one-off backup of a remote CouchDB / Cloudant instance.')
  .action(function () {
    var backup = require('../lib/backup');
    backup(program.remote, function (err, res) {
      if (err) throw err;
      console.log('Backup complete! Wrote', res.docs_written, 'documents.');
    });
  });

// start!
program
  .parse(process.argv);