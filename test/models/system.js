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
const System   = require('../../models/system');
const OSector  = require('../../models/osector');
const ISector  = require('../../models/isector');

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
      context('Invalid', function() {
        it('should fail due to missing name property', function(done) {
          var that = this;
          var system = new System({
            pascode: that.validPass,
            inputPort: that.validIPort,
            outputPort: that.validOPort
          });

          system.save(function(err, system) {
            assert.isNotNull(err, 'expected error; returned none');
            assert.isUndefined(system, 'expected no system; returned system');
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

        it('should fail due to missing passcode property', function(done) {
          var that = this;
          var system = new System({
            name: that.validName,
            inputPort: that.validIPort,
            outputPort: that.validOPort
          });

          system.save(function(err, system) {
            assert.isNotNull(err, 'expected error; returned none');
            assert.isUndefined(system, 'expected no system; returned system');
            done();
          });
        });

        it('should fail due to missing input port property', function(done) {
          var that = this;
          var system = new System({
            name: that.validName,
            passcode: that.validPass,
            outputPort: that.validOPort
          });

          system.save(function(err, system) {
            assert.isNotNull(err, 'expected error; returned none');
            assert.isUndefined(system, 'expected no system; returned system');
            done();
          });
        });

        it('should fail due to missing output port property', function(done) {
          var that = this;
          var system = new System({
            name: that.validName,
            passcode: that.validPass,
            inputPort: that.validIPort
          });

          system.save(function(err, system) {
            assert.isNotNull(err, 'expected error; received none');
            assert.isUndefined(system, 'expected no system; returned system');
            done();
          });
        });
      });

      context('Valid', function() {
        it('should pass due to valid input', function(done) {
          var that = this;
          var system = new System({
            name: that.validName,
            passcode: that.validPass,
            inputPort: that.validIPort,
            outputPort: that.validOPort
          });

          system.save(function(err, system) {
            assert.isNull(err, 'expected no error; returned error');
            assert.isNotNull(system, 'expected system; returned none');
            assert.instanceOf(system, System, 'object was not of type System');
            assert.equal(system.name, that.validName,
                         'unexpected name property');
            done();
          });
        });
      });
    });
  });

  // Read ----------------------------------------------------------------------
  describe('Read', function() {
    before('setting constants', function() {
      this.invalidId   = 99;
      this.unknownId   = '5be16a873dde9a64dbedac38';
      this.validId     = null;

      this.unknownName = 'UnknownSystem';
      this.validName1  = 'TestSystem1';
      this.validName2  = 'TestSystem2';
    });

    beforeEach('creating test objects', function(done) {
      var that = this;

      var newSystem1 = new System({
        name: that.validName1,
        passcode: 'test',
        inputPort: '/dev/ttyUSB0',
        outputPort: '/dev/ttyUSB1'
      });

      var newSystem2 = new System({
        name: that.validName2,
        passcode: 'test',
        inputPort: '/dev/ttyUSB0',
        outputPort: '/dev/ttyUSB1'
      });

      newSystem1.save(function(err, system1) {
        that.validId = system1._id;
        newSystem2.save(function(err, system2) {
          done();
        });
      });
    });

    // Get system by ID --------------------------------------------------------
    describe('#getSytemById', function() {
      context('Invalid', function() {
        it('should fail due to invalid ID', function(done) {
          System.getSystemById(this.invalidId, function(err, ret) {
            assert.isNotNull(err, 'expected error; returned none');
            assert.isUndefined(ret, 'expected no system; returned one');
            done();
          });
        });

        it('should fail due to unknown ID', function (done) {
          System.getSystemById(this.unknownId, function(err, ret) {
            assert.isNull(err, 'expected no error; returned error');
            assert.isNull(ret, 'expected no system; returned system');
            done();
          });
        });
      });

      context('Valid', function() {
        it('should pass and return the test system', function(done) {
          var that = this;
          System.getSystemById(this.validId, function(err, ret) {
            assert.isNull(err, 'expected no error; returned error');
            assert.isNotNull(ret, 'expected system; returned none');
            assert.instanceOf(ret, System, 'object was not of type System');
            assert.equal(ret._id.toString(),
                         that.validId.toString(),
                         'unexpected _id property');
            done();
          });
        });
      });
    });

    // Get System by name ------------------------------------------------------
    describe('#getSystemByName', function() {
      context('Invalid', function() {
        it('should fail due to undefined name', function (done) {
          System.getSystemByName(this.unknownName, function(err, ret) {
            assert.isNull(err, 'expected no error; returned error');
            assert.isNull(ret, 'expected no system; returned system');
            done();
          });
        });
      });

      context('Valid', function() {
        it('should pass and return a system', function(done) {
          var that = this;
          System.getSystemByName(this.validName1, function(err, ret) {
            assert.isNull(err, 'expected no error; returned error');
            assert.isNotNull(ret, 'expected system; returned none');
            assert.instanceOf(ret, System, 'object was not of type System');
            assert.equal(ret.name.toString(),
                         that.validName1.toString(),
                         'unexpected name property');
            done();
          });
        });
      });
    });

    // Get all systems ---------------------------------------------------------
    describe('#getAllSystems', function() {
      context('No Error', function() {
        it('should pass and a list of System objects', function(done) {
          System.getAllSystems(function(err, ret) {
            assert.isNull(err, 'expected no error; returned error');
            assert.isNotNull(ret, 'expected systems; returned none');
            assert.isArray(ret, 'response was not an Array');
            assert.equal(ret.length, 2, 'unexpected Array size');
            ret.forEach(function(item) {
              assert.instanceOf(item, System,
                                'objects are not of type Systems');
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

    beforeEach('creating test objects', function(done) {
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
      context('Invalid', function() {
        it('should fail due to unknown ID', function (done) {
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
            assert.isNull(err, 'expected no error; returned error');
            assert.isNull(ret, 'expected no system; returned system');
            done();
          });
        });
      });

      context('Valid', function() {
        it('should pass and update a system object', function(done) {
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
            assert.isNull(err, 'expected no error; returned error');
            assert.isNotNull(ret, 'expected system; returned none');
            assert.instanceOf(ret, System, 'object was not of type System');

            assert.equal(ret._id.toString(),
                         that.validId.toString(),
                         'unexpected _id property');
            assert.equal(ret.name,
                         that.finName,
                         'name was unchanged');
            assert.equal(ret.passcode,
                         that.finPass,
                         'passcode was unchanged');
            assert.equal(ret.inputPort,
                         that.finIPort,
                         'input port was unchanged');
            assert.equal(ret.outputPort,
                         that.finOPort,
                         'output port was unchanged');
            assert.equal(ret.tempWarning,
                         that.finTempWarn,
                         'temperature warning was unchanged');
            assert.equal(ret.tempCritical,
                         that.finTempCrit,
                         'critical temperature was unchanged');
            assert.equal(ret.humidityWarning,
                         that.finHumWarn,
                         'humidity warning was unchanged');
            assert.equal(ret.humidityCritical,
                         that.finHumCrit,
                         'critical humidity was unchanged');
            assert.equal(ret.pHWarning,
                         that.finPHWarn,
                         'pH warning was unchanged');
            assert.equal(ret.pHCritical,
                         that.finPHCrit,
                         'critical pH was unchanged');
            assert.equal(ret.waterLevelWarning,
                         that.finWLWarn,
                         'water level warning was unchanged');
            assert.equal(ret.waterLevelCritical,
                         that.finWLCrit,
                         'critical water level was unchanged');
            done();
          });
        });
      });
    });
  });

// Delete ----------------------------------------------------------------------
  describe('Delete', function() {
    before('setting constants', function() {
      this.fakeId = '5be16a873dde9a64dbedac38';
      this.systemId  = null;
      this.oSectorId = null;
      this.iSectorId = null;
    });

    beforeEach('creating test objects', function(done) {
      var that = this;
      var oSector = new OSector({
        name: 'Output Sector',
        system: that.fakeId,
        type: 'Water',
        key: 1
      });

      oSector.save(function(err, oSector) {
        that.oSectorId = oSector._id;
        var iSector = new ISector({
          name: 'Input Sector',
          system: that.fakeId,
          type: 'Temperature',
          key: 1
        });

        iSector.save(function(err, iSector) {
          that.iSectorId = iSector._id;
          var system = new System({
            name: 'TestSystem',
            passcode: 'test',
            inputPort: '/dev/ttyUSB0',
            inputSectors: [that.iSectorId],
            outputPort: '/dev/ttyUSB1',
            outputSectors: [that.oSectorId]
          });

          system.save(function(err, system) {
            that.systemId = system._id;
            done()
          });
        });
      });
    });

    // Remove system by ID -----------------------------------------------------
    describe('#removeSystemById', function() {
      context('Invalid', function() {
        it('should fail due to undefined ID', function (done) {
          System.removeSystemById(null, function(err, ret) {
            assert.isNull(err, 'expected no error; returned error');
            assert.isNull(ret, 'expected no system; returned system');
            done();
          });
        });
      });

      context('Valid', function() {
        it('should pass and remove a system and its sectors', function(done) {
          var that = this;
          System.removeSystemById(that.systemId, function(err, ret) {
            assert.isNull(err, 'expected no error; returned error');
            assert.isNotNull(ret, 'expected system; returned none');
            assert.instanceOf(ret, System, 'object was not of type System');
            assert.equal(ret.name.toString(),
                         that.validName1.toString(),
                         'unexpected name');
            done();
          });
        });
      });
    });
  });
});
