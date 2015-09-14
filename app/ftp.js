var FTP = require('ftp')
  , path = require('path')
  , Promise = require('promise')
  , _ = require('underscore')
  , errors = require("./errors.js");

var upload = function (config) {
    return new Promise(function (fulfill, reject) {
        var ftp = new FTP();
        ftp.on('ready', function () {
            ftp.put(config.cryptedFile, path.basename(config.cryptedFile), function (err) {
                if (err) {
                    reject(errors.uploadFailed(err));
                } else {
                    ftp.end();
                    fulfill(config);
                }
            });
        });
          
        ftp.connect(config.ftp);
    });
};
var clean = function (config) {
    return new Promise(function (fulfill, reject) {
        var ftp = new FTP();
        ftp.on('ready', function () {
            ftp.list(function(err, files) {
                if (err) {
                    reject(errors.ftpCleaningFailed(err));
                } else {
                    // Get oldest files
                    var maxDate = new Date(config.date);
                    maxDate.setDate(maxDate.getDate() - config.clean.maxDaysBackup);
                    
                    // var olds = _.filter(files, function(file) { console.log(new Date(file.date)); return true; });
                    var olds = _.filter(files, function(file) { return ((new Date(file.date)) < maxDate); });

                    var promises = [];

                    for (var i = 0; i < olds.length; i++) {
                        promises.push(new Promise(function (done, r) { 
                            ftp.delete(olds[i].name, function(err) { done(); });
                        }));
                    }
                    
                    Promise.all(promises)
                        .then(function(result) { fulfill(config); })
                        .catch(function(result) { fulfill(config); });
                }
            });
        });
    
        ftp.connect(config.ftp);
    });
};

exports.upload = upload;
exports.clean = clean;