/**
 * @file Test Input Event Model
 * @author Jeremy Mallette
 * @version 0.0.0
 * @module Test/Models/IEvent
 */

// Dependencies ----------------------------------------------------------------
const mongoose = require('mongoose');
const assert   = require('chai').assert;

// Local Dependencies ----------------------------------------------------------
const IEvent  = require('../../models/ievent');
const System  = require('../../models/system');
const ISector = require('../../models/isector');
const OSector = require('../../models/osector');

// Test Suite ------------------------------------------------------------------
describe('Input Event', function() {

  beforeEach('creating test system', function(done) {
    var that = this;
    var newSystem = new System({
      name: 'TestSystem',
      passcode: 'test',
      inputPort: '/dev/ttyUSB0',
      outputPort: '/dev/ttyUSB1'
    });

    newSystem.save(function(err, system) {
      if (err) {
        throw err;
      }
      that.systemId = system._id;

      var newOSector = new OSector({
        name: 'TestOutputSector',
        system: that.systemId,
        type: 'Water',
        key: 1
      });

      newOSector.save(function(err, oSector) {
        if (err) {
          throw err;
        }
        that.oSectorId = oSector._id;

        var newISector = new ISector({
          name: 'TestInputSector',
          system: that.systemId,
          type: 'Temperature',
          key: 1
        });

        newISector.save(function(err, iSector) {
          if (err) {
            throw err;
          }
          that.iSectorId = iSector._id;
          done();
        });
      });
    });
  });

  describe('Create', function() {
    // Add Sector --------------------------------------------------------------
    describe('#addIEvent', function() {
      context('Invalid', function() {
        it('should fail due to missing sector property', function(done) {
          var that = this;
          var newIEvent = new IEvent({
            target: that.oSectorId,
            tag: 'TestEvent',
            threshold: 15,
            duration: 60
          });

          IEvent.addIEvent(newIEvent, function(err, iEvent) {
            assert.isNotNull(err, 'expected error; returned none');
            assert.isNull(iEvent, 'expected no event; returned event');
            done();
          });
        });

        it('should fail due to missing target property', function(done) {
          var that = this;
          var newIEvent = new IEvent({
            sector: that.iSectorId,
            tag: 'TestEvent',
            threshold: 15,
            duration: 60
          });

          IEvent.addIEvent(newIEvent, function(err, iEvent) {
            assert.isNotNull(err, 'expected error; returned none');
            assert.isNull(iEvent, 'expected no event; returned event');
            done();
          });
        });

        it('should fail due to missing tag property', function(done) {
          var that = this;
          var newIEvent = new IEvent({
            sector: that.iSectorId,
            target: that.oSectorId,
            threshold: 15,
            duration: 60
          });

          IEvent.addIEvent(newIEvent, function(err, iEvent) {
            assert.isNotNull(err, 'expected error; returned none');
            assert.isNull(iEvent, 'expected no event; returned event');
            done();
          });
        });
      });

      context('Valid', function() {
        it('should pass due to valid input (Water)', function(done) {
          var that = this;
          var newIEvent = new IEvent({
            sector: that.iSectorId,
            target: that.oSectorId,
            tag: 'TestEvent',
            threshold: 15,
            duration: 60
          });

          IEvent.addIEvent(newIEvent, function(err, iEvent) {
            assert.isNull(err, 'expected no error; returned error');
            assert.isNotNull(iEvent, 'expected event; returned none');
            assert.instanceOf(iEvent, IEvent,
                              'object was not of type IEvent');
            assert.equal(iEvent.sector._id.toString(),
                         newIEvent.sector.toString(),
                         'unexpected sector property');
            assert.equal(iEvent.target._id.toString(),
                         newIEvent.target.toString(),
                         'unexpected target property');
            assert.equal(iEvent.tag, newIEvent.tag,
                         'unexpected tag property');
            done();
          });
        });

        it('should add the event to its parent output sector', function(done) {
          var that = this;
          var newIEvent = new IEvent({
            sector: that.iSectorId,
            target: that.oSectorId,
            tag: 'TestEvent',
            threshold: 15,
            duration: 60
          });

          IEvent.addIEvent(newIEvent, function(err, iEvent) {
            assert.isNull(err, 'expected no error; returned error');
            assert.isNotNull(iEvent, 'expected sector; returned none');
            assert.instanceOf(iEvent, IEvent,
                              'object was not of type IEvent');
            OSector.getOSectorById(that.oSectorId, function(err, sector) {
              assert.equal(sector.iEvents.length, 1,
                           'expected only one event in parent');
              assert.equal(sector.iEvents[0].toString(), iEvent._id,
                           'id was not properly added to parent sector');
              done();
            });
          });
        });

        it('should add the event to its parent input sector', function(done) {
          var that = this;
          var newIEvent = new IEvent({
            sector: that.iSectorId,
            target: that.oSectorId,
            tag: 'TestEvent',
            threshold: 15,
            duration: 60
          });

          IEvent.addIEvent(newIEvent, function(err, iEvent) {
            assert.isNull(err, 'expected no error; returned error');
            assert.isNotNull(iEvent, 'expected sector; returned none');
            assert.instanceOf(iEvent, IEvent,
                              'object was not of type IEvent');
            ISector.getISectorById(that.iSectorId, function(err, sector) {
              assert.equal(sector.iEvents.length, 1,
                           'expected only one event in parent');
              assert.equal(sector.iEvents[0].toString(), iEvent._id,
                           'id was not properly added to parent sector');
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

      this.unknownTag = 'UnknownEvent';
      this.validTag1  = 'TestEvent1';
      this.validTag2  = 'TestEvent2';
    });

    beforeEach('creating test objects', function(done) {
      var that = this;
      var newIEvent1 = new IEvent({
        sector: that.iSectorId,
        target: that.oSectorId,
        tag: that.validTag1,
        threshold: 15,
        duration: 60
      });

      var newIEvent2 = new IEvent({
        sector: that.iSectorId,
        target: that.oSectorId,
        tag: that.validTag2,
        threshold: 15,
        duration: 60
      });

      newIEvent1.save(function(err, event1) {
        if (err) {
          throw err;
        }
        that.validId = event1._id;
        newIEvent2.save(function(err, event2) {
          if (err) {
            throw err;
          }
          done();
        });
      });
    });

    // Get sector by ID --------------------------------------------------------
    describe('#getIEventById', function() {
      context('Invalid', function() {
        it('should fail due to invalid ID', function(done) {
          IEvent.getIEventById(this.invalidId, function(err, ret) {
            assert.isNotNull(err, 'expected error; returned none');
            assert.isUndefined(ret, 'expected no system; returned one');
            done();
          });
        });

        it('should fail due to unknown ID', function (done) {
          IEvent.getIEventById(this.unknownId, function(err, ret) {
            assert.isNull(err, 'expected no error; returned error');
            assert.isNull(ret, 'expected no system; returned system');
            done();
          });
        });
      });

      context('Valid', function() {
        it('should pass and return a sector', function(done) {
          var that = this;
          IEvent.getIEventById(this.validId, function(err, ret) {
            assert.isNull(err, 'expected no error; returned error');
            assert.isNotNull(ret, 'expected system; returned none');
            assert.instanceOf(ret, IEvent, 'object was not of type IEvent');
            assert.equal(ret._id.toString(),
                         that.validId.toString(),
                         'unexpected _id property');
            done();
          });
        });
      });
    });

    // Get Sector by name ------------------------------------------------------
    describe('#getIEventByTag', function() {
      context('Invalid', function() {
        it('should fail due to undefined tag', function (done) {
          IEvent.getIEventByTag(this.unknownTag, function(err, ret) {
            assert.isNull(err, 'expected no error; returned error');
            assert.isNull(ret, 'expected no sector; returned sector');
            done();
          });
        });
      });

      context('Valid', function() {
        it('should pass and return an event', function(done) {
          var that = this;
          IEvent.getIEventByTag(this.validTag1, function(err, ret) {
            assert.isNull(err, 'expected no error; returned error');
            assert.isNotNull(ret, 'expected system; returned none');
            assert.instanceOf(ret, IEvent, 'object was not of type IEvent');
            assert.equal(ret.tag.toString(),
                         that.validTag1.toString(),
                         'unexpected tag property');
            done();
          });
        });
      });
    });

    // Get Sector by type ------------------------------------------------------
    describe('#getSectorIEvents', function() {
      context('Invalid', function() {
        it('should fail due to undefined sector', function (done) {
          IEvent.getSectorIEvents('na123', function(err, ret) {
            assert.isNotNull(err, 'expected error; returned none');
            assert.isUndefined(ret, 'expected undefined; returned null|object');
            done();
          });
        });
      });

      context('Valid', function() {
        it('should pass and return an array of sectors', function(done) {
          var that = this;
          IEvent.getSectorIEvents(that.iSectorId, function(err, ret) {
            assert.isNull(err, 'expected no error; returned error');
            assert.isNotNull(ret, 'expected system; returned none');
            assert.isArray(ret, 'response was not an Array');
            assert.equal(ret.length, 2, 'unexpected Array size');
            ret.forEach(function(item) {
              assert.instanceOf(item, IEvent,
                                'objects are not of type IEvent');
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
      this.unknownId     = '5be16a873dde9a64dbedac38';
      this.validId       = null;

      this.initTag       = 'TestEvent';
      this.finTag        = 'UpdatedEvent';
      this.initThreshold = 21;
      this.finThreshold  = 20;
      this.initDuration  = 1;
      this.finDuration   = 2;

      this.invalidSector = 'Foo';
    });

    beforeEach('creating test objects', function(done) {
      var that = this;
      var newIEvent = new IEvent({
        sector: that.iSectorId,
        target: that.oSectorId,
        tag: that.initTag,
        threshold: that.initThreshold,
        duration: that.initDuration
      });

      newIEvent.save(function(err, iEvent) {
        that.validId = iEvent._id;
        done();
      });
    });

    // Update system by ID -----------------------------------------------------
    describe('#updateOSector', function() {
      context('Invalid', function() {
        it('should fail due to unknown ID', function (done) {
          var that = this;
          var newIEvent = new IEvent({
            sector: that.invalidSector,
            target: that.invalidSector,
            tag: that.finTag,
            threshold: that.finThreshold,
            duration: that.finDuration
          });

          IEvent.updateIEvent(newIEvent, function(err, ret) {
            assert.isNull(err, 'expected no error; returned error');
            assert.isNull(ret, 'expected no system; returned system');
            done();
          });
        });
      });

      context('Valid', function() {
        it('should pass and update an event', function(done) {
          var that = this;
          var newIEvent = new IEvent({
            _id: that.validId,
            sector: that.invalidSector,
            target: that.invalidSector,
            tag: that.finTag,
            threshold: that.finThreshold,
            duration: that.finDuration
          });

          IEvent.updateIEvent(newIEvent, function(err, ret) {
            assert.isNull(err, 'expected no error; returned error');
            assert.isNotNull(ret, 'expected system; returned none');
            assert.instanceOf(ret, IEvent, 'object was not of type IEvent');

            assert.equal(ret._id.toString(),
                         that.validId.toString(),
                         'unexpected _id property');
            assert.equal(ret.sector.toString(),
                         that.iSectorId.toString(),
                         'sector was changed');
            assert.equal(ret.target.toString(),
                         that.oSectorId.toString(),
                         'target was changed');
            assert.equal(ret.tag,
                         that.finTag,
                         'tag was unchanged');
            assert.equal(ret.threshold,
                         that.finThreshold,
                         'threshold was unchanged');
            assert.equal(ret.duration,
                         that.finDuration,
                         'duration was unchanged');
            done();
          });
        });
      });
    });
  });

// Delete ----------------------------------------------------------------------
// TODO
});
