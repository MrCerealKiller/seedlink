/**
 * @file Test Timed Event Model
 * @author Jeremy Mallette
 * @version 0.0.0
 * @module Test/Models/TimedEvent
 */

// Dependencies ----------------------------------------------------------------
const mongoose = require('mongoose');
const assert   = require('chai').assert;

// Local Dependencies ----------------------------------------------------------
const TEvent = require('../../models/tevent');
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
      describe('#addTEvent', function() {
        context('Invalid', function() {
          it('should fail due to missing sector property', function(done) {
            var that = this;
            var newTEvent = new TEvent({
              tag: 'TestEvent',
              schedule: {
                dayOfWeek: [1,2,3],
                hour: 7,
                minute: 0
              },
              duration: 60,
            });

            TEvent.addTEvent(newTEvent, function(err, tEvent) {
              assert.isNotNull(err, 'expected error; returned none');
              assert.isNull(tEvent, 'expected no event; returned event');
              done();
            });
          });

          it('should fail due to missing tag property', function(done) {
            var that = this;
            var newTEvent = new TEvent({
              sector: that.oSectorId,
              schedule: {
                dayOfWeek: [1,2,3],
                hour: 7,
                minute: 0
              },
              duration: 60,
            });

            TEvent.addTEvent(newTEvent, function(err, tEvent) {
              assert.isNotNull(err, 'expected error; returned none');
              assert.isNull(tEvent, 'expected no event; returned event');
              done();
            });
          });

          it('should fail due to missing schedule property', function(done) {
            var that = this;
            var newTEvent = new TEvent({
              sector: that.oSectorId,
              tag: 'TestEvent',
              duration: 60,
            });

            TEvent.addTEvent(newTEvent, function(err, tEvent) {
              assert.isNotNull(err, 'expected error; returned none');
              assert.isNull(tEvent, 'expected no event; returned event');
              done();
            });
          });

          it('should fail due to missing duration property', function(done) {
            var that = this;
            var newTEvent = new TEvent({
              sector: that.oSectorId,
              tag: 'TestEvent',
              schedule: {
                dayOfWeek: [1,2,3],
                hour: 7,
                minute: 0
              },
            });

            TEvent.addTEvent(newTEvent, function(err, tEvent) {
              assert.isNotNull(err, 'expected error; returned none');
              assert.isNull(tEvent, 'expected no event; returned event');
              done();
            });
          });

        context('Valid', function() {
          it('should pass due to valid input (Water)', function(done) {
            var that = this;
            var newTEvent = new TEvent({
              sector: that.oSectorId,
              tag: 'TestEvent',
              schedule: {
                dayOfWeek: [1,2,3],
                hour: 7,
                minute: 0
              },
              duration: 60,
            });

            TEvent.addTEvent(newTEvent, function(err, tEvent) {
              assert.isNull(err, 'expected no error; returned error');
              assert.isNotNull(tEvent, 'expected event; returned none');
              assert.instanceOf(tEvent, TEvent,
                                'object was not of type TEvent');
              assert.equal(tEvent.sector._id.toString(),
                           newTEvent.sector.toString(),
                           'unexpected sector property');
              assert.equal(tEvent.tag, newTEvent.tag,
                           'unexpected tag property');
              assert.equal(tEvent.schedule, newTEvent.schedule,
                           'unexpected schedule property');
              assert.equal(tEvent.duration, newTEvent.duration,
                           'unexpected duration property');
              done();
            });
          });

          it('should add the event to its parent output sector', function(done) {
            var that = this;
            var newTEvent = new TEvent({
              sector: that.oSectorId,
              tag: 'TestEvent',
              schedule: {
                dayOfWeek: [1,2,3],
                hour: 7,
                minute: 0
              },
              duration: 60,
            });

            TEvent.addTEvent(newTEvent, function(err, tEvent) {
              assert.isNull(err, 'expected no error; returned error');
              assert.isNotNull(tEvent, 'expected sector; returned none');
              assert.instanceOf(tEvent, TEvent,
                                'object was not of type TEvent');
              OSector.getOSectorById(that.oSectorId, function(err, sector) {
                assert.equal(sector.tEvents.length, 1,
                             'expected only one event in parent');
                assert.equal(sector.tEvents[0].toString(), tEvent._id,
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
        var newTEvent1 = new TEvent({
          sector: that.oSectorId,
          tag: that.validTag1,
          schedule: {
            dayOfWeek: [1,2,3],
            hour: 7,
            minute: 0
          },
          duration: 60,
        });

        var newTEvent2 = new TEvent({
          sector: that.oSectorId,
          tag: that.validTag2,
          schedule: {
            dayOfWeek: [1,2,3],
            hour: 7,
            minute: 0
          },
          duration: 60,
        });

        newTEvent1.save(function(err, event1) {
          if (err) {
            throw err;
          }
          that.validId = event1._id;
          newTEvent2.save(function(err, event2) {
            if (err) {
              throw err;
            }
            done();
          });
        });
      });

      // Get sector by ID --------------------------------------------------------
      describe('#getTEventById', function() {
        context('Invalid', function() {
          it('should fail due to invalid ID', function(done) {
            TEvent.getTEventById(this.invalidId, function(err, ret) {
              assert.isNotNull(err, 'expected error; returned none');
              assert.isUndefined(ret, 'expected no system; returned one');
              done();
            });
          });

          it('should fail due to unknown ID', function (done) {
            TEvent.getTEventById(this.unknownId, function(err, ret) {
              assert.isNull(err, 'expected no error; returned error');
              assert.isNull(ret, 'expected no system; returned system');
              done();
            });
          });
        });

        context('Valid', function() {
          it('should pass and return a sector', function(done) {
            var that = this;
            TEvent.getTEventById(this.validId, function(err, ret) {
              assert.isNull(err, 'expected no error; returned error');
              assert.isNotNull(ret, 'expected system; returned none');
              assert.instanceOf(ret, TEvent, 'object was not of type TEvent');
              assert.equal(ret._id.toString(),
                           that.validId.toString(),
                           'unexpected _id property');
              done();
            });
          });
        });
      });

      // Get Sector by name ------------------------------------------------------
      describe('#getTEventByTag', function() {
        context('Invalid', function() {
          it('should fail due to undefined tag', function (done) {
            TEvent.getTEventByTag(this.unknownTag, function(err, ret) {
              assert.isNull(err, 'expected no error; returned error');
              assert.isNull(ret, 'expected no sector; returned sector');
              done();
            });
          });
        });

        context('Valid', function() {
          it('should pass and return an event', function(done) {
            var that = this;
            TEvent.getTEventByTag(this.validTag1, function(err, ret) {
              assert.isNull(err, 'expected no error; returned error');
              assert.isNotNull(ret, 'expected system; returned none');
              assert.instanceOf(ret, TEvent, 'object was not of type TEvent');
              assert.equal(ret.tag.toString(),
                           that.validTag1.toString(),
                           'unexpected tag property');
              done();
            });
          });
        });
      });

      // Get Sector by type ------------------------------------------------------
      describe('#getSectorTEvents', function() {
        context('Invalid', function() {
          it('should fail due to undefined sector', function (done) {
            TEvent.getSectorTEvents('na123', function(err, ret) {
              assert.isNotNull(err, 'expected error; returned none');
              assert.isUndefined(ret, 'expected undefined; returned null|object');
              done();
            });
          });
        });

        context('Valid', function() {
          it('should pass and return an array of sectors', function(done) {
            var that = this;
            TEvent.getSectorTEvents(that.oSectorId, function(err, ret) {
              assert.isNull(err, 'expected no error; returned error');
              assert.isNotNull(ret, 'expected system; returned none');
              assert.isArray(ret, 'response was not an Array');
              assert.equal(ret.length, 2, 'unexpected Array size');
              ret.forEach(function(item) {
                assert.instanceOf(item, TEvent,
                                  'objects are not of type TEvent');
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
        this.initSched     = {
          dayOfWeek: [1,2,3],
          hour: 7,
          minute: 0
        };
        this.finSched      = {
          dayOfWeek: [2,3,4],
          hour: 20,
          minute: 30
        },;
        this.initDuration  = 61;
        this.finDuration   = 60;

        this.invalidSector = 'Foo';
      });

      beforeEach('creating test objects', function(done) {
        var that = this;
        var newTEvent = new TEvent({
          sector: that.oSectorId,
          tag: that.initTag,
          schedule: that.initSched,
          duration: that.initDuration,
        });

        newTEvent.save(function(err, tEvent) {
          that.validId = tEvent._id;
          done();
        });
      });

      // Update system by ID -----------------------------------------------------
      describe('#updateOSector', function() {
        context('Invalid', function() {
          it('should fail due to unknown ID', function (done) {
            var that = this;
            var newTEvent = new TEvent({
              sector: that.invalidSector,
              tag: that.finTag,
              schedule: that.finSched,
              duration: that.finDuration,
            });

            TEvent.updateTEvent(newTEvent, function(err, ret) {
              assert.isNull(err, 'expected no error; returned error');
              assert.isNull(ret, 'expected no system; returned system');
              done();
            });
          });
        });

        context('Valid', function() {
          it('should pass and update an event', function(done) {
            var that = this;
            var newTEvent = new TEvent({
              _id: that.validId,
              sector: that.invalidSector,
              tag: that.finTag,
              schedule: that.finSched,
              duration: that.finDuration,
            });

            TEvent.updateTEvent(newTEvent, function(err, ret) {
              assert.isNull(err, 'expected no error; returned error');
              assert.isNotNull(ret, 'expected system; returned none');
              assert.instanceOf(ret, TEvent, 'object was not of type TEvent');

              assert.equal(ret._id.toString(),
                           that.validId.toString(),
                           'unexpected _id property');
              assert.equal(ret.sector.toString(),
                           that.oSectorId.toString(),
                           'sector was changed');
              assert.equal(ret.tag,
                           that.finTag,
                           'tag was unchanged');
              assert.equal(ret.schedule,
                           that.finSched,
                           'schedule was unchanged');
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
