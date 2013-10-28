var path = require('path');

exports.get_db_name = function () {
  var now = new Date(),
      db_name = [now.getFullYear(), now.getMonth(), now.getDate()].join('-');

  return db_name;
};