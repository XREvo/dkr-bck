var assert = require("assert")
  , fs = require("fs")
  , exec = require('child_process').exec
  , backup = require("../app/backup.js")
  , config = require("../app/config.js")
  , errors = require("../app/errors.js")
  , tools = require('../extras/clone.js');

require('../extras/date.format.js');
  
describe('Backup', function() {
    var fullConfig = { };
    
    before(function(done) {
       var fileName = './test/assets/config.full.json'; 
       config.toJSON(fileName)
            .then(config.validate)
            .then(function (result) {
                fullConfig = result;
                done();
            });
    });
    
    describe('Check backup directory: ', function () {
        it('should return a content unavailable error if directory don\'t exists', function (done) {
            var cfg = tools.clone(fullConfig);
            cfg.backupDirectory = './test/fakeDirectory/';
            
            backup.check(cfg).catch(function(err) { 
                assert(err);
                assert(err.type);
                assert.equal(err.type, errors.types.contentUnavailable);
                assert(err.directory);
                assert.equal(err.directory, cfg.backupDirectory);
                
                done();
            });
        });
        it('should return a no content to backup error if directory don\'t exists', function (done) {
            var cfg = tools.clone(fullConfig);
            cfg.backupDirectory = './test/assets/empty/';
            
            backup.check(cfg).catch(function(err) { 
                assert(err);
                assert(err.type);
                assert.equal(err.type, errors.types.noContentToBackup);
                assert(err.directory);
                assert.equal(err.directory, cfg.backupDirectory);
                
                done();
            });
        });
        it('should return config file there is something to backup', function (done) {
            var cfg = tools.clone(fullConfig);
            cfg.backupDirectory = './test/';
            
            backup.check(cfg).then(function(result) { 
                assert.deepEqual(cfg, result);
                
                done();
            });
        });
    });
    
    describe('Compress directory content: ', function () {
        it('should return config file wth zipFile property filled', function (done) {
            var cfg = tools.clone(fullConfig);
            cfg.backupDirectory = './test/';
            
            backup.compress(cfg).then(function(result) { 
                var expected = tools.clone(cfg);
                expected.zipFile = expected.workDirectory + expected.date.format('yyyymmdd-HHMMss') + '.zip';
                assert.deepEqual(expected, result)
                
                if (expected.zipFile) {
                    fs.unlink(expected.zipFile);
                }
                
                done();
            });
        });
    });
    
    describe('Crypt zip file: ', function () {
        it('should return config file wth cryptedFile property filled', function (done) {
            var cfg = tools.clone(fullConfig);
            cfg.zipFile = './test/assets/zipFile.zip';
            
            backup.crypt(cfg).then(function(result) { 
                var expected = tools.clone(cfg);
                expected.cryptedFile = expected.zipFile + '.crypt';
                assert.deepEqual(expected, result)
                
                if (expected.cryptedFile) {
                    fs.unlink(expected.cryptedFile);
                }
                
                done();
            });
        });
    });
    
    describe('Clean work directory: ', function () {
        it('should end with an empty work directory', function (done) {
            var cfg = tools.clone(fullConfig);
            cfg.workDirectory = './test/assets/clean/';
            
            exec('touch ' + cfg.workDirectory + '1.txt', function(err, stdout, stderr) {
                exec('touch ' + cfg.workDirectory + '2.txt', function(err, stdout, stderr) {
                    backup.clean(cfg).then(function(result) { 
                        fs.readdir(cfg.workDirectory, function(err, files) {
                            assert(files);
                            assert.equal(files.length, 0);
                            
                            done();
                        });
                    });
                });
            });
        });
    });
});