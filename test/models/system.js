// Dependencies ----------------------------------------------------------------
const bluebird      = require('bluebird');
const mongoose      = require('mongoose');

// Local Dependencies ----------------------------------------------------------
const System = require('../../models/system');
const db     = require('../../config/database'); // Development configuration

// Aserrtions ------------------------------------------------------------------
var assert = require('chai').assert;

// Test Suite ------------------------------------------------------------------
describe('System', function() {

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
  describe('.getSytemById', function() {
    context('Invalid ID', function() {
      it('should return an error and null', function(done) {
        System.getSystemById(invalidId, function(err, ret) {
          assert.isNotNull(err);
          assert.isNull(ret);
          done();
        });
      });
    });
    context('Unknown ID', function() {
      it('should return no error and null', function (done) {
        System.getSystemById(unknownId, function(err, ret) {
          assert.isNull(err);
          assert.isNull(ret);
          done();
        });
      });
    });
    context('Known ID', function() {
      it('should return no error and an IEvent object', function(done) {
        System.getSystemById(validId, function(err, ret) {
          assert.isNull(err);
          assert.isNotNull(ret);
          assert.instanceOf(ret, System);
          assert.equal(ret._id, validId);
          done();
        });
      });
    });
  });

  // Get event by tag ----------------------------------------------------------
  describe('.getSystemByName', function() {
    context('Invalid Name', function() {
      it('should return an error and null', function(done) {
        System.getSystemByName(invalidName, function(err, ret) {
          assert.isNotNull(err);
          assert.isNull(ret);
          done();
        });
      });
    });
    context('Unknown Name', function() {
      it('should return no error and null', function (done) {
        System.getSystemByName(unknownName, function(err, ret) {
          assert.isNull(err);
          assert.isNull(ret);
          done();
        });
      });
    });
    context('Known Name', function() {
      it('should return no error and a System object', function(done) {
        System.getSystemByName(validName, function(err, ret) {
          assert.isNull(err);
          assert.isNotNull(ret);
          assert.instanceOf(ret, System);
          assert.equal(ret.name, validName);
          done();
        });
      });
    });
  });

  // Get sector events ---------------------------------------------------------
  describe('.getAllSystems', function() {
    context('No Error', function() {
      it('should return no error and a list of System objects', function(done) {
        System.getAllSystems(function(err, ret) {
          assert.isNull(err);
          assert.isNotNull(ret);
          assert.isArray(ret);
          ret.forEach(function(item) {
            assert.instanceOf(item, IEvent);
          });
          done();
        });
      });
    });
  });
});
