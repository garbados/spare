var path = require('path'),
    url = require('url'),
    fs = require('fs');

var BACKUP_DIR = path.join(process.env.HOME, '.spares');

exports.get_db_name = function get_db_name (remote, date) {
  var now = new Date(),
      parts = url.parse(remote),
      db_name = parts.pathname;
      
  date = date || [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('-');

  [BACKUP_DIR, path.join(BACKUP_DIR, db_name)].forEach(function (dir) {
    try {
      fs.mkdirSync(dir);
    } catch (e) {
      if (e.code !== 'EEXIST') throw e;
    }
  });
    
  var backup_name = path.join(BACKUP_DIR, db_name, date);
  return backup_name;
};