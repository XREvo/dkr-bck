// REQUIRES
var cfg = require('./app/config.js')
  , bck = require('./app/backup.js')
  , ftp = require('./app/ftp.js')
  , CronJob = require('cron').CronJob;
 
// POLYFILLS
require('./extras/date.format.js');

// GLOBAL VARIABLES
var configFilePath = '/usr/cfg/config.json';

// PROCESS
var doBackup = function(config, shutdown) {
    console.log('start backup at: ' + (new Date()).format('yyyy-mm-dd HH:MM:ss'));
    
    cfg.setDefaults(config)
    .then(bck.check)
    .then(bck.compress)
    .then(bck.crypt)
    .then(ftp.upload)
    .then(ftp.clean)
    .then(bck.clean)
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

cfg.toJSON(configFilePath)
    .then(cfg.validate)
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
