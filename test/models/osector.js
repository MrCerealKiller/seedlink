/**
 * @file Test Output Sector Model
 * @author Jeremy Mallette
 * @version 0.0.0
 * @module Test/Models/OSector
 */

// Dependencies ----------------------------------------------------------------
const mongoose = require('mongoose');
const assert   = require('chai').assert;

// Local Dependencies ----------------------------------------------------------
const OSector = require('../../models/osector');
const System  = require('../../models/system');

// Test Suite ------------------------------------------------------------------
describe('Output Sector', function() {

  beforeEach('creating test system', function(done) {
    var that = this;
    var system = new System({
      name: 'TestSystem',
      passcode: 'test',
      inputPort: '/dev/ttyUSB0',
      outputPort: '/dev/ttyUSB1'
    });

    system.save(function(err, system) {
      if (err) {
        throw err;
      }
      that.systemId = system._id;
      done();
    });
  });

  describe('Create', function() {
    // Add Sector --------------------------------------------------------------
    describe('#addOSector', function() {
      context('Invalid', function() {
        it('should fail due to missing name property', function(done) {
          var that = this;
          var newSector = new OSector({
            system: that.systemId,
            type: 'Water',
            key: 1
          });

          OSector.addOSector(newSector, function(err, sector) {
            assert.isNotNull(err, 'expected error; returned none');
            assert.isNull(sector, 'expected no sector; returned sector');
            done();
          });
        });

        it('should fail due to missing system property', function(done) {
          var that = this;
          var newSector = new OSector({
            name: 'TestSector',
            type: 'Water',
            key: 1
          });

          OSector.addOSector(newSector, function(err, sector) {
            assert.isNotNull(err, 'expected error; returned none');
            assert.isNull(sector, 'expected no sector; returned sector');
            done();
          });
        });

        it('should fail due to missing key property', function(done) {
          var that = this;
          var newSector = new OSector({
            name: 'TestSector',
            system: that.systemId,
            type: 'Water'
          });

          OSector.addOSector(newSector, function(err, sector) {
            assert.isNotNull(err, 'expected error; returned none');
            assert.isNull(sector, 'expected no sector; returned sector');
            done();
          });
        });
      });

      context('Valid', function() {
        it('should pass due to valid input (Water)', function(done) {
          var that = this;
          var newSector = new OSector({
            name: 'TestSector',
            system: that.systemId,
            type: 'Water',
            key: 1
          });

          OSector.addOSector(newSector, function(err, sector) {
            assert.isNull(err, 'expected no error; returned error');
            assert.isNotNull(sector, 'expected sector; returned none');
            assert.instanceOf(sector, OSector,
                              'object was not of type OSector');
            assert.equal(sector.name, newSector.name,
                         'unexpected name property');
            assert.equal(sector.system._id.toString(),
                         that.systemId.toString(),
                         'unexpected system property');
            assert.equal(sector.type, newSector.type,
                         'unexpected type property');
            assert.equal(sector.key, newSector.key,
                         'unexpected key property');
            done();
          });
        });

        it('should pass due to valid input (Lights)', function(done) {
          var that = this;
          var newSector = new OSector({
            name: 'TestSector',
            system: that.systemId,
            type: 'Lights',
            key: 1
          });

          OSector.addOSector(newSector, function(err, sector) {
            assert.isNull(err, 'expected no error; returned error');
            assert.isNotNull(sector, 'expected sector; returned none');
            assert.instanceOf(sector, OSector,
                              'object was not of type OSector');
            assert.equal(sector.name, newSector.name,
                         'unexpected name property');
            assert.equal(sector.system._id.toString(),
                         that.systemId.toString(),
                         'unexpected system property');
            assert.equal(sector.type, newSector.type,
                         'unexpected type property');
            assert.equal(sector.key, newSector.key,
                         'unexpected key property');
            done();
          });
        });

        it('should pass due to valid input (Fans)', function(done) {
          var that = this;
          var newSector = new OSector({
            name: 'TestSector',
            system: that.systemId,
            type: 'Fans',
            key: 1
          });

          OSector.addOSector(newSector, function(err, sector) {
            assert.isNull(err, 'expected no error; returned error');
            assert.isNotNull(sector, 'expected sector; returned none');
            assert.instanceOf(sector, OSector,
                              'object was not of type OSector');
            assert.equal(sector.name, newSector.name,
                         'unexpected name property');
            assert.equal(sector.system._id.toString(),
                         that.systemId.toString(),
                         'unexpected system property');
            assert.equal(sector.type, newSector.type,
                         'unexpected type property');
            assert.equal(sector.key, newSector.key,
                         'unexpected key property');
            done();
          });
        });

        it('should pass due to valid input (Pump)', function(done) {
          var that = this;
          var newSector = new OSector({
            name: 'TestSector',
            system: that.systemId,
            type: 'Pump',
            key: 1
          });

          OSector.addOSector(newSector, function(err, sector) {
            assert.isNull(err, 'expected no error; returned error');
            assert.isNotNull(sector, 'expected sector; returned none');
            assert.instanceOf(sector, OSector,
                              'object was not of type OSector');
            assert.equal(sector.name, newSector.name,
                         'unexpected name property');
            assert.equal(sector.system._id.toString(),
                         that.systemId.toString(),
                         'unexpected system property');
            assert.equal(sector.type, newSector.type,
                         'unexpected type property');
            assert.equal(sector.key, newSector.key,
                         'unexpected key property');
            done();
          });
        });

        it('should add the sector to its parent system', function(done) {
          var that = this;
          var newSector = new OSector({
            name: 'TestSector',
            system: that.systemId,
            type: 'Water',
            key: 1
          });

          OSector.addOSector(newSector, function(err, sector) {
            assert.isNull(err, 'expected no error; returned error');
            assert.isNotNull(sector, 'expected sector; returned none');
            assert.instanceOf(sector, OSector,
                              'object was not of type OSector');
            System.getSystemById(that.systemId.toString(), function(err, system) {
              assert.equal(system.outputSectors.length, 1,
                           'expected only one event in parent');
              assert.equal(system.outputSectors[0].toString(), sector._id,
                           'id was not properly added to parent system');
              done();
            });
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

      this.unknownName = 'UnknownSector';
      this.validName1  = 'TestSector1';
      this.validName2  = 'TestSector2';
    });

    beforeEach('creating test objects', function(done) {
      var that = this;
      var newSector1 = new OSector({
        name: that.validName1,
        system: that.systemId,
        type: 'Water',
        key: 1
      });

      var newSector2 = new OSector({
        name: that.validName2,
        system: that.systemId,
        type: 'Water',
        key: 1
      });

      newSector1.save(function(err, sector1) {
        if (err) {
          throw err;
        }
        that.validId = sector1._id;
        newSector2.save(function(err, sector2) {
          if (err) {
            throw err;
          }
          done();
        });
      });
    });

    // Get sector by ID --------------------------------------------------------
    describe('#getOSectorById', function() {
      context('Invalid', function() {
        it('should fail due to invalid ID', function(done) {
          OSector.getOSectorById(this.invalidId, function(err, ret) {
            assert.isNotNull(err, 'expected error; returned none');
            assert.isUndefined(ret, 'expected no system; returned one');
            done();
          });
        });

        it('should fail due to unknown ID', function (done) {
          OSector.getOSectorById(this.unknownId, function(err, ret) {
            assert.isNull(err, 'expected no error; returned error');
            assert.isNull(ret, 'expected no system; returned system');
            done();
          });
        });
      });

      context('Valid', function() {
        it('should pass and return a sector', function(done) {
          var that = this;
          OSector.getOSectorById(this.validId, function(err, ret) {
            assert.isNull(err, 'expected no error; returned error');
            assert.isNotNull(ret, 'expected system; returned none');
            assert.instanceOf(ret, OSector, 'object was not of type OSector');
            assert.equal(ret._id.toString(),
                         that.validId.toString(),
                         'unexpected _id property');
            done();
          });
        });
      });
    });

    // Get Sector by name ------------------------------------------------------
    describe('#getOSectorByName', function() {
      context('Invalid', function() {
        it('should fail due to undefined name', function (done) {
          OSector.getOSectorByName(this.unknownName, function(err, ret) {
            assert.isNull(err, 'expected no error; returned error');
            assert.isNull(ret, 'expected no sector; returned sector');
            done();
          });
        });
      });

      context('Valid', function() {
        it('should pass and return a sector', function(done) {
          var that = this;
          OSector.getOSectorByName(this.validName1, function(err, ret) {
            assert.isNull(err, 'expected no error; returned error');
            assert.isNotNull(ret, 'expected system; returned none');
            assert.instanceOf(ret, OSector, 'object was not of type OSector');
            assert.equal(ret.name.toString(),
                         that.validName1.toString(),
                         'unexpected name property');
            done();
          });
        });
      });
    });

    // Get Sector by type ------------------------------------------------------
    describe('#getOSectorsByType', function() {
      context('Invalid', function() {
        it('should fail due to undefined type', function (done) {
          OSector.getOSectorsByType('na123', function(err, ret) {
            assert.isNull(err, 'expected no error; returned error');
            assert.isNotNull(ret, 'expected array; returned none');
            assert.isArray(ret, 'expected array; returned other');
            assert.equal(ret.length, 0, 'expected empty array; had elements');
            done();
          });
        });
      });

      context('Valid', function() {
        it('should pass and return an array of sectors', function(done) {
          var that = this;
          OSector.getOSectorsByType('Water', function(err, ret) {
            assert.isNull(err, 'expected no error; returned error');
            assert.isNotNull(ret, 'expected system; returned none');
            assert.isArray(ret, 'response was not an Array');
            assert.equal(ret.length, 2, 'unexpected Array size');
            ret.forEach(function(item) {
              assert.instanceOf(item, OSector,
                                'objects are not of type OSector');
            });
            done();
          });
        });
      });
    });
  });

  // Update --------------------------------------------------------------------
  describe('Update', function() {
    before('setting constants', function() {
      this.unknownId   = '5be16a873dde9a64dbedac38';
      this.validId     = null;

      this.initName    = 'TestSector';
      this.finName     = 'UpdatedSector';
      this.initType    = 'Water';
      this.finType     = 'Pump';
      this.initKey     = 1;
      this.finKey      = 2;
      this.fakeEvent1  = '5be16a873dde9a64dbedac40';
      this.fakeEvent2  = '5be16a873dde9a64dbedac50';

      this.invalidType = 'Foo';
      this.attemptSys  = 'Bar';
    });

    beforeEach('creating test objects', function(done) {
      var that = this;
      var newSector = new OSector({
        name: that.initName,
        system: that.systemId,
        type: that.initType,
        key: that.initKey,
        iEvents: [that.fakeEvent1],
        oEvents: [that.fakeEvent1]
      });

      newSector.save(function(err, sector) {
        that.validId = sector._id;
        done();
      });
    });

    // Update system by ID -----------------------------------------------------
    describe('#updateOSector', function() {
      context('Invalid', function() {
        it('should fail due to unknown ID', function (done) {
          var that = this;
          var unknownSector = new OSector({
            _id: that.unknownId,
            name: that.finName,
            system: that.attemptSys,
            type: that.finType,
            key: that.finKey,
            iEvents: [that.fakeEvent2],
            oEvents: [that.fakeEvent2]
          });

          OSector.updateOSector(unknownSector, function(err, ret) {
            assert.isNull(err, 'expected no error; returned error');
            assert.isNull(ret, 'expected no system; returned system');
            done();
          });
        });
      });

      context('Valid', function() {
        it('should pass and update a sector', function(done) {
          var that = this;
          var validSector = new OSector({
            _id: that.validId,
            name: that.finName,
            system: that.attemptSys,
            type: that.finType,
            key: that.finKey,
            iEvents: [that.fakeEvent2],
            oEvents: [that.fakeEvent2]
          });

          OSector.updateOSector(validSector, function(err, ret) {
            assert.isNull(err, 'expected no error; returned error');
            assert.isNotNull(ret, 'expected system; returned none');
            assert.instanceOf(ret, OSector, 'object was not of type OSector');

            assert.equal(ret._id.toString(),
                         that.validId.toString(),
                         'unexpected _id property');
            assert.equal(ret.name,
                         that.finName,
                         'name was unchanged');
            assert.equal(ret.system.toString(),
                         that.systemId.toString(),
                         'system was changed');
            assert.equal(ret.type,
                         that.finType,
                         'type was unchanged');
            assert.equal(ret.key,
                         that.finKey,
                         'key was unchanged');
            assert.equal(ret.iEvents[0],
                         that.fakeEvent2,
                         'iEvents unchanged');
            assert.equal(ret.oEvents[0],
                         that.fakeEvent2,
                         'oEvents unchanged');
            done();
          });
        });
      });
    });
  });

// Delete ----------------------------------------------------------------------
// TODO
});
