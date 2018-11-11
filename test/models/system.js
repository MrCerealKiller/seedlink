/**
 * @file Test System Model
 * @author Jeremy Mallette
 * @version 0.0.0
 * @module Test/Models/System
 */

// Dependencies ----------------------------------------------------------------
const mongoose = require('mongoose');
const assert   = require('chai').assert;

// Local Dependencies ----------------------------------------------------------
const System = require('../../models/system');

// Test Suite ------------------------------------------------------------------
describe('System', function() {

  describe('Create', function() {
    before('setting constants', function() {
      this.validName = 'TestSystem';
      this.validPass = 'test';
      this.validIPort = '/dev/ttyUSB0';
      this.validOPort = '/dev/ttyUSB1';
    });

    // Add System --------------------------------------------------------------
    describe('#addSystem', function() {
      context('Invalid System', function() {
        it('should fail by missing name', function(done) {
          var that = this;
          var system = new System({
            pascode: that.validPass,
            inputPort: that.validIPort,
            outputPort: that.validOPort
          });

          system.save(function(err, system) {
            assert.isNotNull(err, 'error was null');
            assert.isUndefined(system, 'returned an object');
            done();
          });
        });
        // it('should fail by duplicate name', function(done) {
        //   var that = this;
        //   var system = new System({
        //     name: that.validName,
        //     passcode: that.validPass,
        //     inputPort: that.validIPort,
        //     outputPort: that.validOPort
        //   });
        //
        //   system.save(function(err, system) {
        //     var dupSystem = new System({
        //       name: that.validName,
        //       passcode: that.validPass,
        //       inputPort: that.validIPort,
        //       outputPort: that.validOPort
        //     });
        //
        //     dupSystem.save(function(err, dupSystem) {
        //       assert.isNotNull(err, 'error was null');
        //       assert.isUndefined(dupSystem, 'returned an object');
        //       done();
        //     });
        //   });
        // });
        it('should fail by missing passcode', function(done) {
          var that = this;
          var system = new System({
            name: that.validName,
            inputPort: that.validIPort,
            outputPort: that.validOPort
          });

          system.save(function(err, system) {
            assert.isNotNull(err, 'error was null');
            assert.isUndefined(system, 'returned an object');
            done();
          });
        });
        it('should fail by missing input port', function(done) {
          var that = this;
          var system = new System({
            name: that.validName,
            passcode: that.validPass,
            outputPort: that.validOPort
          });

          system.save(function(err, system) {
            assert.isNotNull(err, 'error was null');
            assert.isUndefined(system, 'returned an object');
            done();
          });
        });
        it('should fail by invalid output port', function(done) {
          var that = this;
          var system = new System({
            name: that.validName,
            passcode: that.validPass,
            inputPort: that.validIPort
          });

          system.save(function(err, system) {
            assert.isNotNull(err, 'error was null');
            assert.isUndefined(system, 'returned an object');
            done();
          });
        });
      });
      context('Valid System', function() {
        it('should pass with valid input', function(done) {
          var that = this;
          var system = new System({
            name: that.validName,
            passcode: that.validPass,
            inputPort: that.validIPort,
            outputPort: that.validOPort
          });

          var name = system.name;
          system.save(function(err, system) {
            assert.isNull(err, 'returned an error');
            assert.isNotNull(system, 'did not return an object');
            assert.instanceOf(system, System, 'object is not a System');
            assert.equal(system.name, name, 'unexpected name');
            done();
          });
        });
      });
    });
  });

// Read ------------------------------------------------------------------------
  describe('Read', function() {
    before('setting constants', function() {
      this.invalidId   = 99;
      this.unknownId   = '5be16a873dde9a64dbedac38';
      this.validId     = null;

      this.unknownName = 'UnknownSystem';
      this.validName1  = 'TestSystem1';
      this.validName2  = 'TestSystem2';
    });

    beforeEach('Create Systems', function(done) {
      var name1 = this.validName1;
      var name2 = this.validName2;

      var testSystem1 = new System({
        name: name1,
        passcode: 'test',
        inputPort: '/dev/ttyUSB0',
        outputPort: '/dev/ttyUSB1'
      });
      var testSystem2 = new System({
        name: name2,
        passcode: 'test',
        inputPort: '/dev/ttyUSB0',
        outputPort: '/dev/ttyUSB1'
      });
      var that = this;
      testSystem1.save(function(err, system1) {
        that.validId = system1._id;
        testSystem2.save(function(err, system2) {
          done();
        });
      });
    });

    // Get system by ID --------------------------------------------------------
    describe('#getSytemById', function() {
      context('Invalid ID', function() {
        it('should return an error and undefined', function(done) {
          System.getSystemById(this.invalidId, function(err, ret) {
            assert.isNotNull(err, 'did not return an error');
            assert.isUndefined(ret, 'returned an object');
            done();
          });
        });
      });
      context('Unknown ID', function() {
        it('should return no error and null', function (done) {
          System.getSystemById(this.unknownId, function(err, ret) {
            assert.isNull(err, 'returned an error');
            assert.isNull(ret, 'returned an object');
            done();
          });
        });
      });
      context('Known ID', function() {
        it('should return no error and an System object', function(done) {
          var that = this;
          System.getSystemById(this.validId, function(err, ret) {
            assert.isNull(err, 'returned an error');
            assert.isNotNull(ret, 'did not return an object');
            assert.instanceOf(ret, System, 'object was not a System');
            assert.equal(ret._id.toString(),
                         that.validId.toString(),
                         'unexpected id');
            done();
          });
        });
      });
    });

    // Get System by name ------------------------------------------------------
    describe('#getSystemByName', function() {
      context('Unknown Name', function() {
        it('should return no error and null', function (done) {
          System.getSystemByName(this.unknownName, function(err, ret) {
            assert.isNull(err, 'returned an error');
            assert.isNull(ret, 'returned an object');
            done();
          });
        });
      });
      context('Known Name', function() {
        it('should return no error and a System object', function(done) {
          var that = this;
          System.getSystemByName(this.validName1, function(err, ret) {
            assert.isNull(err, 'returned an error');
            assert.isNotNull(ret, 'did not return an object');
            assert.instanceOf(ret, System, 'object was not a System');
            assert.equal(ret.name.toString(),
                         that.validName1.toString(),
                         'unexpected name');
            done();
          });
        });
      });
    });

    // Get all systems ---------------------------------------------------------
    describe('#getAllSystems', function() {
      context('No Error', function() {
        it('should return no error and a list of System objects', function(done) {
          System.getAllSystems(function(err, ret) {
            assert.isNull(err, 'returned an error');
            assert.isNotNull(ret, 'did not return response');
            assert.isArray(ret, 'response was not an Array');
            assert.equal(ret.length, 2, 'unexpected Array size');
            ret.forEach(function(item) {
              assert.instanceOf(item, System, 'objects are not Systems');
            });
            done();
          });
        });
      });
    });
  });

// Update ----------------------------------------------------------------------
  describe('Update', function() {
    before('setting constants', function() {
      this.unknownId   = '5be16a873dde9a64dbedac38';
      this.validId     = null;

      this.initName = 'TestSystem';
      this.finName = 'UpdatedSystem';
      this.initPass = 'testPasscode';
      this.finPass = 'updatedPasscode';
      this.initIPort = '/dev/ttyUSB0';
      this.finIPort = '/dev/input';
      this.initOPort = '/dev/ttyUSB1';
      this.finOPort = '/dev/output';

      this.initTempWarn = '21';
      this.finTempWarn = '20';
      this.initTempCrit = '11';
      this.finTempCrit = '10';
      this.initHumWarn = '56';
      this.finHumWarn = '55';
      this.initHumCrit = '26';
      this.finHumCrit = '25';
      this.initPHWarn = '4';
      this.finPHWarn = '3.5';
      this.initPHCrit = '2.1';
      this.finPHCrit = '2';
      this.initWLWarn = '200';
      this.finWLWarn = '150';
      this.initWLCrit = '100';
      this.finWLCrit = '50';
    });

    beforeEach('Create Systems', function(done) {
      var that = this;
      var testSystem = new System({
        name: that.initName,
        passcode: that.initPass,
        inputPort: that.initIPort,
        outputPort: that.initOPort,
        tempWarning: that.initTempWarn,
        tempCritical: that.initTempCrit,
        humidityWarning: that.initHumWarn,
        humidityCritical: that.initHumCrit,
        pHWarning: that.initPHWarn,
        pHCritical: that.initPHCrit,
        waterLevelWarning: that.initWLWarn,
        waterLevelCritical: that.initWLCrit
      });
      testSystem.save(function(err, system) {
        that.validId = system._id;
        done();
      });
    });

    // Update system by ID -----------------------------------------------------
    describe('#updateSystem', function() {
      context('Invalid ID', function() {
        it('should return an error and null', function(done) {
          var that = this;
          var invalidSys = new System({
            name: that.finName,
            passcode: that.finPass,
            inputPort: that.finIPort,
            outputPort: that.finOPort,
            tempWarning: that.finTempWarn,
            tempCritical: that.finTempCrit,
            humidityWarning: that.finHumWarn,
            humidityCritical: that.finHumCrit,
            pHWarning: that.finPHWarn,
            pHCritical: that.finPHCrit,
            waterLevelWarning: that.finWLWarn,
            waterLevelCritical: that.finWLCrit
          });

          System.updateSystem(invalidSys, function(err, ret) {
            assert.isNull(ret, 'returned an object');
            done();
          });
        });
      });
      context('Unknown ID', function() {
        it('should return no error and null', function (done) {
          var that = this;
          var unknownSys = new System({
            _id: that.unknownId,
            name: that.finName,
            passcode: that.finPass,
            inputPort: that.finIPort,
            outputPort: that.finOPort,
            tempWarning: that.finTempWarn,
            tempCritical: that.finTempCrit,
            humidityWarning: that.finHumWarn,
            humidityCritical: that.finHumCrit,
            pHWarning: that.finPHWarn,
            pHCritical: that.finPHCrit,
            waterLevelWarning: that.finWLWarn,
            waterLevelCritical: that.finWLCrit
          });

          System.updateSystem(unknownSys, function(err, ret) {
            assert.isNull(err, 'returned an error');
            assert.isNull(ret, 'returned an object');
            done();
          });
        });
      });
      context('Known ID', function() {
        it('should return no error and an System object', function(done) {
          var that = this;
          var system = new System({
            _id: that.validId,
            name: that.finName,
            passcode: that.finPass,
            inputPort: that.finIPort,
            outputPort: that.finOPort,
            tempWarning: that.finTempWarn,
            tempCritical: that.finTempCrit,
            humidityWarning: that.finHumWarn,
            humidityCritical: that.finHumCrit,
            pHWarning: that.finPHWarn,
            pHCritical: that.finPHCrit,
            waterLevelWarning: that.finWLWarn,
            waterLevelCritical: that.finWLCrit
          });

          System.updateSystem(system, function(err, ret) {
            assert.isNull(err, 'returned an error');
            assert.isNotNull(ret, 'did not return an object');
            assert.instanceOf(ret, System, 'object was not a System');

            assert.equal(ret._id.toString(),
                         that.validId.toString(),
                         'id changed');
            assert.equal(ret.name,
                         that.finName,
                         'name unchanged');
            assert.equal(ret.passcode,
                         that.finPass,
                         'passcode unchanged');
            assert.equal(ret.inputPort,
                         that.finIPort,
                         'input port unchanged');
            assert.equal(ret.outputPort,
                         that.finOPort,
                         'output port unchanged');
            assert.equal(ret.tempWarning,
                         that.finTempWarn,
                         'temperature warning unchanged');
            assert.equal(ret.tempCritical,
                         that.finTempCrit,
                         'critical temperature unchanged');
            assert.equal(ret.humidityWarning,
                         that.finHumWarn,
                         'humidity warning unchanged');
            assert.equal(ret.humidityCritical,
                         that.finHumCrit,
                         'critical humidity unchanged');
            assert.equal(ret.pHWarning,
                         that.finPHWarn,
                         'pH warning unchanged');
            assert.equal(ret.pHCritical,
                         that.finPHCrit,
                         'critical pH unchanged');
            assert.equal(ret.waterLevelWarning,
                         that.finWLWarn,
                         'water level warning unchanged');
            assert.equal(ret.waterLevelCritical,
                         that.finWLCrit,
                         'critical water level unchanged');
            done();
          });
        });
      });
    });
  });
});
