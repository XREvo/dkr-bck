process.env['mocha-unfunk-style'] = 'html'

var assert = require("assert")
  , config = require("../app/config.js")
  , errors = require("../app/errors.js");
  
describe('Configuration file', function() {
    describe('Reading file: ', function () {
        it('should return a file not found error if config file don\'t exists', function (done) {
            var fakeFileName = 'fake file name';
            config.toJSON(fakeFileName).catch(function(err) { 
                assert(err);
                assert(err.type);
                assert.equal(err.type, errors.types.fileNotFound);
                assert(err.path);
                assert.equal(err.path, fakeFileName);
                
                done();
            });
        });
        it('should return an object corresponding to file structure content', function (done) {
            var fileName = './test/assets/config.full.json';
            config.toJSON(fileName).then(function (result) { 
                assert(result);
                assert(result.ftp);
                assert.equal(result.ftp.host, 'ftp.example.com');
                assert.equal(result.ftp.port, 21);
                assert.equal(result.ftp.username, 'username');
                assert.equal(result.ftp.password, 'password');
                
                assert(result.crypto);
                assert.equal(result.crypto.algorithm, 'aes-256-ctr');
                assert.equal(result.crypto.key, 'my cryptographic key');
                
                assert(result.cron);
                assert.equal(result.cron.active, true);
                assert.equal(result.cron.time, '00 00 05 * * *');
                
                assert(result.clean);
                assert.equal(result.clean.active, true);
                assert.equal(result.clean.maxDaysBackup, 7);
                
                done();
            });
        });
    });
    describe('Validate: ', function () {
        var fullConfig = { };
        
        before(function(done) {
           var fileName = './test/assets/config.full.json'; 
           config.toJSON(fileName).then(function (result) { 
               fullConfig = result;
               done();
           });
        });
        
        describe('FTP configuration: ', function () {
            it('should return an invalid config file error if no ftp config is specified', function (done) {
                var cfg = {};
                config.validate(cfg).catch(function(err) { 
                    assert(err);
                    assert(err.type);
                    assert.equal(err.type, errors.types.invalidConfigFile);
                    
                    done();
                });
            });
            
            it('should return an invalid config file error if no ftp host is specified', function (done) {
                var cfg = JSON.parse(JSON.stringify(fullConfig));
                delete cfg.ftp.host;
                
                config.validate(cfg).catch(function(err) { 
                    assert(err);
                    assert(err.type);
                    assert.equal(err.type, errors.types.invalidConfigFile);
                    
                    done();
                });
            });
            it('should return an invalid config file error if ftp host is empty', function (done) {
                var cfg = JSON.parse(JSON.stringify(fullConfig));
                cfg.ftp.host = '';
                
                config.validate(cfg).catch(function(err) { 
                    assert(err);
                    assert(err.type);
                    assert.equal(err.type, errors.types.invalidConfigFile);
                    
                    done();
                });
            });
            
            it('should return an invalid config file error if no ftp username is specified', function (done) {
                var cfg = JSON.parse(JSON.stringify(fullConfig));
                delete cfg.ftp.username;
                
                config.validate(cfg).catch(function(err) { 
                    assert(err);
                    assert(err.type);
                    assert.equal(err.type, errors.types.invalidConfigFile);
                    
                    done();
                });
            });
            it('should return an invalid config file error if ftp username is empty', function (done) {
                var cfg = JSON.parse(JSON.stringify(fullConfig));
                cfg.ftp.username = '';
                
                config.validate(cfg).catch(function(err) { 
                    assert(err);
                    assert(err.type);
                    assert.equal(err.type, errors.types.invalidConfigFile);
                    
                    done();
                });
            });
            
            it('should return an invalid config file error if no ftp password is specified', function (done) {
                var cfg = JSON.parse(JSON.stringify(fullConfig));
                delete cfg.ftp.password;
                
                config.validate(cfg).catch(function(err) { 
                    assert(err);
                    assert(err.type);
                    assert.equal(err.type, errors.types.invalidConfigFile);
                    
                    done();
                });
            });
            it('should return an invalid config file error if ftp password is empty', function (done) {
                var cfg = JSON.parse(JSON.stringify(fullConfig));
                cfg.ftp.password = '';
                
                config.validate(cfg).catch(function(err) { 
                    assert(err);
                    assert(err.type);
                    assert.equal(err.type, errors.types.invalidConfigFile);
                    
                    done();
                });
            });
            
            it('should set ftp port to 21 if not specified', function (done) {
                var cfg = JSON.parse(JSON.stringify(fullConfig));
                delete cfg.ftp.port;
                
                config.validate(cfg).then(function (result) { 
                    assert.equal(result.ftp.port, 21);
                    
                    done();
                });
            });
        });
        
        describe('Cryptographic configuration: ', function () {
            it('should return an invalid config file error if no crypto config is specified', function (done) {
                var cfg = JSON.parse(JSON.stringify(fullConfig));
                delete cfg.crypto;
                
                config.validate(cfg).catch(function(err) { 
                    assert(err);
                    assert(err.type);
                    assert.equal(err.type, errors.types.invalidConfigFile);
                    
                    done();
                });
            });
            
            it('should return an invalid config file error if no crypto key is specified', function (done) {
                var cfg = JSON.parse(JSON.stringify(fullConfig));
                delete cfg.crypto.key;
                
                config.validate(cfg).catch(function(err) { 
                    assert(err);
                    assert(err.type);
                    assert.equal(err.type, errors.types.invalidConfigFile);
                    
                    done();
                });
            });
            it('should return an invalid config file error if crypto key is empty', function (done) {
                var cfg = JSON.parse(JSON.stringify(fullConfig));
                cfg.crypto.key = '';
                
                config.validate(cfg).catch(function(err) { 
                    assert(err);
                    assert(err.type);
                    assert.equal(err.type, errors.types.invalidConfigFile);
                    
                    done();
                });
            });
            
            it('should set crypto algorithm to aes-256-ctr if not specified', function (done) {
                var cfg = JSON.parse(JSON.stringify(fullConfig));
                delete cfg.crypto.algorithm;
                
                config.validate(cfg).then(function(result) { 
                    assert.equal(result.crypto.algorithm, 'aes-256-ctr');
                    
                    done();
                });
            });
        });
        
        describe('Cron Job configuration: ', function () {
            it('should set as inactive cron if cron config is not specified', function (done) {
                var cfg = JSON.parse(JSON.stringify(fullConfig));
                delete cfg.cron;
                
                config.validate(cfg).then(function(result) { 
                    assert.deepEqual(result.cron , { active: false, time : '' });
                    
                    done();
                });
            });
            it('should set as inactive if active flag is not specified', function (done) {
                var cfg = JSON.parse(JSON.stringify(fullConfig));
                delete cfg.cron.active;
                
                config.validate(cfg).then(function(result) { 
                    assert.equal(result.cron.active , false);
                    
                    done();
                });
            });
            it('should set as inactive if time properties is not specified', function (done) {
                var cfg = JSON.parse(JSON.stringify(fullConfig));
                delete cfg.cron.time;
                
                config.validate(cfg).then(function(result) { 
                    assert.equal(result.cron.active , false);
                    assert.equal(result.cron.time , '');
                    
                    done();
                });
            });
            it('should set as inactive if time properties is empty', function (done) {
                var cfg = JSON.parse(JSON.stringify(fullConfig));
                cfg.cron.time = '';
                
                config.validate(cfg).then(function(result) { 
                    assert.equal(result.cron.active , false);
                    assert.equal(result.cron.time , '');
                    
                    done();
                });
            });
        });
        
        describe('Clean configuration: ', function () {
            it('should set as inactive cron if clean config is not specified', function (done) {
                var cfg = JSON.parse(JSON.stringify(fullConfig));
                delete cfg.clean;
                
                config.validate(cfg).then(function(result) { 
                    assert.deepEqual(result.clean , { active: false, maxDaysBackup : 1 });
                    
                    done();
                });
            });
            it('should set as inactive if active flag is not specified', function (done) {
                var cfg = JSON.parse(JSON.stringify(fullConfig));
                delete cfg.clean.active;
                
                config.validate(cfg).then(function(result) { 
                    assert.equal(result.clean.active , false);
                    
                    done();
                });
            });
            it('should set as inactive if maxDaysBackup properties is not specified', function (done) {
                var cfg = JSON.parse(JSON.stringify(fullConfig));
                delete cfg.clean.maxDaysBackup;
                
                config.validate(cfg).then(function(result) { 
                    assert.equal(result.clean.active , false);
                    assert.equal(result.clean.maxDaysBackup , 1);
                    
                    done();
                });
            });
            it('should set as inactive if maxDaysBackup properties <= 0', function (done) {
                var cfg = JSON.parse(JSON.stringify(fullConfig));
                cfg.clean.maxDaysBackup = '';
                
                config.validate(cfg).then(function(result) { 
                    assert.equal(result.clean.active , false);
                    assert.equal(result.clean.maxDaysBackup , 1);
                    
                    done();
                });
            });
        });
    });
});