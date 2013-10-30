var watch = require('../lib/watch'),
    cron = require('cron');

new cron.CronJob('0 0 * * *', watch(process.argv[2], process.argv[3]));
