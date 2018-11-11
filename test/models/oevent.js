/**
 * @file Test Output Event Model
 * @author Jeremy Mallette
 * @version 0.0.0
 * @module Test/Models/OEvent
 */

// Dependencies ----------------------------------------------------------------
const mongoose = require('mongoose');
const assert   = require('chai').assert;

// Local Dependencies ----------------------------------------------------------
const OEvent = require('../../models/oevent');
const System = require('../../models/system');
const OSector = require('../../models/osector');

// Test Suite ------------------------------------------------------------------
describe('Output Event', function() {

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
          done();
        });
      });
    });

    describe('Create', function() {
      // Add Sector --------------------------------------------------------------
      describe('#addOEvent', function() {
        context('Invalid', function() {
          it('should fail due to missing sector property', function(done) {
            var that = this;
            var newOEvent = new OEvent({
              tag: 'TestEvent',
              start: 600,
              duration: 60,
              interval: 1
            });

            OEvent.addOEvent(newOEvent, function(err, oEvent) {
              assert.isNotNull(err, 'expected error; returned none');
              assert.isNull(oEvent, 'expected no event; returned event');
              done();
            });
          });

          it('should fail due to missing tag property', function(done) {
            var that = this;
            var newOEvent = new OEvent({
              sector: that.oSectorId,
              start: 600,
              duration: 60,
              interval: 1
            });

            OEvent.addOEvent(newOEvent, function(err, oEvent) {
              assert.isNotNull(err, 'expected error; returned none');
              assert.isNull(oEvent, 'expected no event; returned event');
              done();
            });
          });

          it('should fail due to missing start property', function(done) {
            var that = this;
            var newOEvent = new OEvent({
              sector: that.oSectorId,
              tag: 'TestEvent',
              duration: 60,
              interval: 1
            });

            OEvent.addOEvent(newOEvent, function(err, oEvent) {
              assert.isNotNull(err, 'expected error; returned none');
              assert.isNull(oEvent, 'expected no event; returned event');
              done();
            });
          });

          it('should fail due to missing duration property', function(done) {
            var that = this;
            var newOEvent = new OEvent({
              sector: that.oSectorId,
              tag: 'TestEvent',
              start: 600,
              interval: 1
            });

            OEvent.addOEvent(newOEvent, function(err, oEvent) {
              assert.isNotNull(err, 'expected error; returned none');
              assert.isNull(oEvent, 'expected no event; returned event');
              done();
            });
          });

          it('should fail due to missing interval property', function(done) {
            var that = this;
            var newOEvent = new OEvent({
              sector: that.oSectorId,
              tag: 'TestEvent',
              start: 600,
              duration: 60
            });

            OEvent.addOEvent(newOEvent, function(err, oEvent) {
              assert.isNotNull(err, 'expected error; returned none');
              assert.isNull(oEvent, 'expected no event; returned event');
              done();
            });
          });
        });

        context('Valid', function() {
          it('should pass due to valid input (Water)', function(done) {
            var that = this;
            var newOEvent = new OEvent({
              sector: that.oSectorId,
              tag: 'TestEvent',
              start: 600,
              duration: 60,
              interval: 1
            });

            OEvent.addOEvent(newOEvent, function(err, oEvent) {
              assert.isNull(err, 'expected no error; returned error');
              assert.isNotNull(oEvent, 'expected event; returned none');
              assert.instanceOf(oEvent, OEvent,
                                'object was not of type OEvent');
              assert.equal(oEvent.sector._id.toString(),
                           newOEvent.sector.toString(),
                           'unexpected sector property');
              assert.equal(oEvent.tag, newOEvent.tag,
                           'unexpected tag property');
              assert.equal(oEvent.start, newOEvent.start,
                           'unexpected start property');
              assert.equal(oEvent.duration, newOEvent.duration,
                           'unexpected duration property');
              assert.equal(oEvent.interval, newOEvent.interval,
                           'unexpected interval property');
              done();
            });
          });

          it('should add the event to its parent output sector', function(done) {
            var that = this;
            var newOEvent = new OEvent({
              sector: that.oSectorId,
              tag: 'TestEvent',
              start: 600,
              duration: 60,
              interval: 1
            });

            OEvent.addOEvent(newOEvent, function(err, oEvent) {
              assert.isNull(err, 'expected no error; returned error');
              assert.isNotNull(oEvent, 'expected sector; returned none');
              assert.instanceOf(oEvent, OEvent,
                                'object was not of type OEvent');
              OSector.getOSectorById(that.oSectorId, function(err, sector) {
                assert.equal(sector.oEvents.length, 1,
                             'expected only one event in parent');
                assert.equal(sector.oEvents[0].toString(), oEvent._id,
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
        var newOEvent1 = new OEvent({
          sector: that.oSectorId,
          tag: that.validTag1,
          start: 600,
          duration: 60,
          interval: 1
        });

        var newOEvent2 = new OEvent({
          sector: that.oSectorId,
          tag: that.validTag2,
          start: 600,
          duration: 60,
          interval: 1
        });

        newOEvent1.save(function(err, event1) {
          if (err) {
            throw err;
          }
          that.validId = event1._id;
          newOEvent2.save(function(err, event2) {
            if (err) {
              throw err;
            }
            done();
          });
        });
      });

      // Get sector by ID --------------------------------------------------------
      describe('#getOEventById', function() {
        context('Invalid', function() {
          it('should fail due to invalid ID', function(done) {
            OEvent.getOEventById(this.invalidId, function(err, ret) {
              assert.isNotNull(err, 'expected error; returned none');
              assert.isUndefined(ret, 'expected no system; returned one');
              done();
            });
          });

          it('should fail due to unknown ID', function (done) {
            OEvent.getOEventById(this.unknownId, function(err, ret) {
              assert.isNull(err, 'expected no error; returned error');
              assert.isNull(ret, 'expected no system; returned system');
              done();
            });
          });
        });

        context('Valid', function() {
          it('should pass and return a sector', function(done) {
            var that = this;
            OEvent.getOEventById(this.validId, function(err, ret) {
              assert.isNull(err, 'expected no error; returned error');
              assert.isNotNull(ret, 'expected system; returned none');
              assert.instanceOf(ret, OEvent, 'object was not of type OEvent');
              assert.equal(ret._id.toString(),
                           that.validId.toString(),
                           'unexpected _id property');
              done();
            });
          });
        });
      });

      // Get Sector by name ------------------------------------------------------
      describe('#getOEventByTag', function() {
        context('Invalid', function() {
          it('should fail due to undefined tag', function (done) {
            OEvent.getOEventByTag(this.unknownTag, function(err, ret) {
              assert.isNull(err, 'expected no error; returned error');
              assert.isNull(ret, 'expected no sector; returned sector');
              done();
            });
          });
        });

        context('Valid', function() {
          it('should pass and return an event', function(done) {
            var that = this;
            OEvent.getOEventByTag(this.validTag1, function(err, ret) {
              assert.isNull(err, 'expected no error; returned error');
              assert.isNotNull(ret, 'expected system; returned none');
              assert.instanceOf(ret, OEvent, 'object was not of type OEvent');
              assert.equal(ret.tag.toString(),
                           that.validTag1.toString(),
                           'unexpected tag property');
              done();
            });
          });
        });
      });

      // Get Sector by type ------------------------------------------------------
      describe('#getSectorOEvents', function() {
        context('Invalid', function() {
          it('should fail due to undefined sector', function (done) {
            OEvent.getSectorOEvents('na123', function(err, ret) {
              assert.isNotNull(err, 'expected error; returned none');
              assert.isUndefined(ret, 'expected undefined; returned null|object');
              done();
            });
          });
        });

        context('Valid', function() {
          it('should pass and return an array of sectors', function(done) {
            var that = this;
            OEvent.getSectorOEvents(that.oSectorId, function(err, ret) {
              assert.isNull(err, 'expected no error; returned error');
              assert.isNotNull(ret, 'expected system; returned none');
              assert.isArray(ret, 'response was not an Array');
              assert.equal(ret.length, 2, 'unexpected Array size');
              ret.forEach(function(item) {
                assert.instanceOf(item, OEvent,
                                  'objects are not of type OEvent');
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
        this.initStart     = 601;
        this.finStart      = 600;
        this.initDuration  = 61;
        this.finDuration   = 60;
        this.initInterval  = 2;
        this.finInterval   = 1;

        this.invalidSector = 'Foo';
      });

      beforeEach('creating test objects', function(done) {
        var that = this;
        var newOEvent = new OEvent({
          sector: that.oSectorId,
          tag: that.initTag,
          start: that.initStart,
          duration: that.initDuration,
          interval: that.initInterval
        });

        newOEvent.save(function(err, oEvent) {
          that.validId = oEvent._id;
          done();
        });
      });

      // Update system by ID -----------------------------------------------------
      describe('#updateOSector', function() {
        context('Invalid', function() {
          it('should fail due to unknown ID', function (done) {
            var that = this;
            var newOEvent = new OEvent({
              sector: that.invalidSector,
              tag: that.finTag,
              start: that.finStart,
              duration: that.finDuration,
              interval: that.finInterval
            });

            OEvent.updateOEvent(newOEvent, function(err, ret) {
              assert.isNull(err, 'expected no error; returned error');
              assert.isNull(ret, 'expected no system; returned system');
              done();
            });
          });
        });

        context('Valid', function() {
          it('should pass and update an event', function(done) {
            var that = this;
            var newOEvent = new OEvent({
              _id: that.validId,
              sector: that.invalidSector,
              tag: that.finTag,
              start: that.finStart,
              duration: that.finDuration,
              interval: that.finInterval
            });

            OEvent.updateOEvent(newOEvent, function(err, ret) {
              assert.isNull(err, 'expected no error; returned error');
              assert.isNotNull(ret, 'expected system; returned none');
              assert.instanceOf(ret, OEvent, 'object was not of type OEvent');

              assert.equal(ret._id.toString(),
                           that.validId.toString(),
                           'unexpected _id property');
              assert.equal(ret.sector.toString(),
                           that.oSectorId.toString(),
                           'sector was changed');
              assert.equal(ret.tag,
                           that.finTag,
                           'tag was unchanged');
              assert.equal(ret.start,
                           that.finStart,
                           'start was unchanged');
              assert.equal(ret.duration,
                           that.finDuration,
                           'duration was unchanged');
              assert.equal(ret.interval,
                           that.finInterval,
                           'interval was unchanged');
              done();
            });
          });
        });
      });
    });

  // Delete ----------------------------------------------------------------------
  // TODO
  });
