var fs = require('fs')
  , Promise = require('promise')
  , errors = require("./errors.js");

var toJSON = function(filePath) {
    return new Promise(function (fulfill, reject) {
        fs.exists(filePath, function(exists) {
            if (exists) {
                fs.stat(filePath, function(error, stats) {
                    if (stats.isFile()){
                        fs.open(filePath, "r", function(error, fd) {
                            if (error) {
                                reject(errors.fileNotFound(filePath, error));
                            } else {
                                var buffer = new Buffer(stats.size);
                                
                                fs.read(fd, buffer, 0, buffer.length, null, function(error, bytesRead, buffer) {
                                    var data = buffer.toString("utf8", 0, buffer.length);
                                    fulfill(JSON.parse(data));
                                    fs.close(fd);
                                });
                            }
                        });
                    } else {
                        reject(errors.fileNotFound(filePath, error));
                    }
                });
            } else {
                reject(errors.fileNotFound(filePath));
            }
        });
    });
};

var validate = function(config) {
    return new Promise(function (fulfill, reject) {
        if (!config ||
            !config.ftp ||
            !config.ftp.host ||
            !config.ftp.host.length ||
             config.ftp.host.length == 0 ||
            !config.ftp.user ||
            !config.ftp.user.length ||
             config.ftp.user.length == 0 ||
            !config.ftp.password ||
            !config.ftp.password.length ||
             config.ftp.password.length == 0 ||
            !config.crypto ||
            !config.crypto.key ||
            !config.crypto.key.length ||
             config.crypto.key.length == 0) {
            reject(errors.invalidConfigFile());
        } else {
            if (!config.ftp.port) 
                config.ftp.port = 21;
                
            if (!config.crypto.algorithm) 
                config.crypto.algorithm = 'aes-256-ctr';
                
            if (!config.cron) {
                config.cron = {
                    active: false,
                    time: ''
                };
            } else {
                if (!config.cron.active) {
                    config.cron.active = false;
                }
                
                if (!config.cron.time || !config.cron.time.length || config.cron.time.length == 0) {
                    config.cron.active = false;
                    config.cron.time = '';
                }
            }
                
            if (!config.clean) {
                config.clean = {
                    active: false,
                    maxDaysBackup: 1
                };
            } else {
                if (!config.clean.active) {
                    config.clean.active = false;
                }
                
                if (!config.clean.maxDaysBackup || config.clean.maxDaysBackup <= 0) {
                    config.clean.active = false;
                    config.clean.maxDaysBackup = 1;
                }
            }
            
            config.date = new Date();
            config.backupDirectory = '/backup/';
            config.zipFile = '';
            config.cryptedFile = '';
            config.workDirectory = '/tmp/work/';
            
            fulfill(config);
        }
    });
};

exports.toJSON = toJSON;
exports.validate = validate;