// REQUIRES
var config = require('./app/config.js')
  , backup = require('./app/backup.js')
  , ftp = require('./app/ftp.js')
  , CronJob = require('cron').CronJob;
 
// POLYFILLS
require('./extras/date.format.js');

// GLOBAL VARIABLES
var configFilePath = '/usr/cfg/config.json';

// PROCESS
var doBackup = function(config, shutdown) {
    console.log('start backup at: ' + (new Date()).format('yyyy-mm-dd HH:MM:ss'));
    
    config.setDefaults(config)
    .then(backup.check)
    .then(backup.compress)
    .then(backup.crypt)
    .then(ftp.upload)
    .then(ftp.clean)
    .then(backup.clean)
    .then(function(result) {
        console.log("backup done!");
    })
    .catch(function(err) {
        console.log("backup rejected!");
        console.log(err);
    })
    .finally(function () {
        if (shutdown === true)
            process.exit(0);
    });
};

config.toJSON(configFilePath)
    .then(config.validate)
    .then(function(config) {
        if (config.cron.active) {
            console.log('backup cron time: ' + config.cron.time);
            var job = new CronJob({
                cronTime: config.cron.time,
                onTick: function() { doBackup(config, false); }
            });
            job.start();
        } else {
            doBackup(config, true);
        }
    });
