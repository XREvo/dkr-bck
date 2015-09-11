// REQUIRES
var config = require('./app/config.js')
  , backup = require('./app/backup.js')
  , ftp = require('./app/ftp.js');
require('./extras/date.format.js');

// GLOBAL VARIABLES
var configFilePath = '/tmp/config/config.json';

// PROCESS
config.toJSON(configFilePath)
    .then(config.validate)
    // .then(backup.check)
    // .then(backup.compress)
    // .then(backup.crypt)
    // .then(ftp.upload)
    // .then(ftp.clean)
    // .then(backup.clean)
    .then(function(result) {
        console.log("backup done!");
        process.exit(0);
    })
    .catch(function(err) {
        console.log("backup rejected!");
        console.log(err);
    });

