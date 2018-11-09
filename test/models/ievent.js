// Dependencies ----------------------------------------------------------------
const bluebird      = require('bluebird');
const mongoose      = require('mongoose');

// Local Dependencies ----------------------------------------------------------
const IEvent = require('../../models/ievent');
const db     = require('../../config/database'); // Development configuration

// Aserrtions ------------------------------------------------------------------
var assert = require('chai').assert;

// Test Suite ------------------------------------------------------------------
describe('Input Event', function() {

  before('Connecting to test database', function(done) {
    mongoose.connect((process.env.MONGO_URL || db.test_database), db.opts);
    mongoose.Promise = bluebird;

    mongoose.connection.on('connected', function() {
        console.log('Sucessfully connected to database\n');
        done();
    });

    mongoose.connection.on('error', function(err) {
        throw new Error('Error connecting to database\nError: ' + err + '\n');
        done()
    });
  });

  // Get event by ID -----------------------------------------------------------
  describe('.getIEventById', function() {
    context('Invalid ID', function() {
      it('should return an error and null', function(done) {
        IEvent.getIEventById(invalidId, function(err, ret) {
          assert.isNotNull(err);
          assert.isNull(ret);
          done();
        });
      });
    });
    context('Unknown ID', function() {
      it('should return no error and null', function (done) {
        IEvent.getIEventById(unknownId, function(err, ret) {
          assert.isNull(err);
          assert.isNull(ret);
          done();
        });
      });
    });
    context('Known ID', function() {
      it('should return no error and an IEvent object', function(done) {
        IEvent.getIEventById(validId, function(err, ret) {
          assert.isNull(err);
          assert.isNotNull(ret);
          assert.instanceOf(ret, IEvent);
          assert.equal(ret._id, validId);
          done();
        });
      });
    });
  });

  // Get event by tag ----------------------------------------------------------
  describe('.getIEventByTag', function() {
    context('Invalid Tag', function() {
      it('should return an error and null', function(done) {
        IEvent.getIEventByTag(invalidTag, function(err, ret) {
          assert.isNotNull(err);
          assert.isNull(ret);
          done();
        });
      });
    });
    context('Unknown Tag', function() {
      it('should return no error and null', function (done) {
        IEvent.getIEventByTag(unknownTag, function(err, ret) {
          assert.isNull(err);
          assert.isNull(ret);
          done();
        });
      });
    });
    context('Known Tag', function() {
      it('should return no error and an IEvent object', function(done) {
        IEvent.getIEventByTag(validTag, function(err, ret) {
          assert.isNull(err);
          assert.isNotNull(ret);
          assert.instanceOf(ret, IEvent);
          assert.equal(ret.tag, validTag);
          done();
        });
      });
    });
  });

  // Get sector events ---------------------------------------------------------
  describe('.getSectorIEvents', function() {
    context('Invalid Sector', function() {
      it('should return an error and null', function(done) {
        IEvent.getSectorIEvents(invalidSector, function(err, ret) {
          assert.isNotNull(err);
          assert.isNull(ret);
          done();
        });
      });
    });
    context('Unused Sector', function() {
      it('should return no error and null', function (done) {
        IEvent.getSectorIEvents(unknownSector, function(err, ret) {
          assert.isNull(err);
          assert.isNull(ret);
          done();
        });
      });
    });
    context('Used Sector', function() {
      it('should return no error and a list of IEvent objects', function(done) {
        IEvent.getIEventById(validSector, function(err, ret) {
          assert.isNull(err);
          assert.isNotNull(ret);
          assert.isArray(ret);
          ret.forEach(function(item) {
            assert.instanceOf(item, IEvent);
            assert.equal(item.sector, validSector);
          });
          done();
        });
      });
    });
  });
});
