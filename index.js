// REQUIRES
var config = require('./app/config.js');

// GLOBAL VARIABLES
var configFilePath = '/tmp/config/config.json';

// PROCESS
config.toJSON(configFilePath)
    .then(config.validate)
    .then(function(validated) {
        console.log("validated!");
        console.log(validated);
    })
    .catch(function(err) {
        console.log("rejected!");
        console.log(err);
    });