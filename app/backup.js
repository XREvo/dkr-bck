var fs = require('fs')
  , Promise = require('promise')
  , crypto = require('crypto')
  , errors = require("./errors.js")
  , exec = require('child_process').exec;

// POLYFILLS
require('../extras/date.format.js');

var check = function(config) {
    return new Promise(function (fulfill, reject) {
        fs.readdir(config.backupDirectory, function(err, files) {
            if (err) {
                reject(errors.contentUnavailable(config.backupDirectory, err));
            } else {
                if (files && files.length && files.length > 0)
                    fulfill(config);
                else
                    reject(errors.noContentToBackup(config.backupDirectory));
            }
        });
    });
};
var compress = function(config) {
    return new Promise(function (fulfill, reject) {
        var outputFile = config.workDirectory + config.date.format('yyyymmdd-HHMMss') + '.tar.gz';
        
        try {
            var command = 'tar -zcf ' + outputFile + ' ' +  config.backupDirectory

            var child = exec(command, function (error, stdout, stderr) {
                if (error !== null) {
                    reject(errors.compressionFailed(config.backupDirectory, outputFile, error));
                } else {
                    config.zipFile = outputFile;
                    fulfill(config);
                }
            });
        } catch (e) {
            reject(errors.compressionFailed(config.backupDirectory, outputFile, e));
        }
    });
};
var crypt = function(config) {
    return new Promise(function (fulfill, reject) {
        var outputFile = config.zipFile + '.crypt';
            
        try {
            var input = fs.createReadStream(config.zipFile);
            var output = fs.createWriteStream(outputFile);
            var encrypt = crypto.createCipher(config.crypto.algorithm, config.crypto.key);

            input.pipe(encrypt).pipe(output);
            
            config.cryptedFile = outputFile;
            
            fulfill(config)
        } catch (e) {
            reject(errors.encryptionFailed(config.zipFile, outputFile, e));}
    });
};
var clean = function(config) {
    return new Promise(function (fulfill, reject) {
        fs.readdir(config.workDirectory, function(err, files) {
            if (!err) {
                if (files && files.length && files.length > 0) {
                    for (var i = 0; i < files.length; i++) { 
                        var file = files[i];
                        fs.unlink(config.workDirectory + file, function(err) { });
                    }
                }
            }
            
            fulfill(config);
        });
    });
};

exports.check = check;
exports.compress = compress;
exports.crypt = crypt;
exports.clean = clean;