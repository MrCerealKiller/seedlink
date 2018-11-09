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
const IEvent = require('../../models/ievent');

// Test Suite ------------------------------------------------------------------
describe('Input Event', function() {

  // Get event by ID -----------------------------------------------------------
  describe('#getIEventById', function() {
    context('Invalid ID', function() {
      var invalidId = 'na123';
      it('should return an error and null', function(done) {
        IEvent.getIEventById(invalidId, function(err, ret) {
          assert.isNotNull(err);
          assert.isNull(ret);
          done();
        });
      });
    });
    context('Unknown ID', function() {
      var unknownId = '324567889';
      it('should return no error and null', function (done) {
        IEvent.getIEventById(unknownId, function(err, ret) {
          assert.isNull(err);
          assert.isNull(ret);
          done();
        });
      });
    });
    context('Known ID', function() {
      var knownId = '32456789898765434';
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
  describe('#getIEventByTag', function() {
    context('Invalid Tag', function() {
      var invalidTag = 99;
      it('should return an error and null', function(done) {
        IEvent.getIEventByTag(invalidTag, function(err, ret) {
          assert.isNotNull(err);
          assert.isNull(ret);
          done();
        });
      });
    });
    context('Unknown Tag', function() {
      var unknownTag = 'UnknownEvent';
      it('should return no error and null', function (done) {
        IEvent.getIEventByTag(unknownTag, function(err, ret) {
          assert.isNull(err);
          assert.isNull(ret);
          done();
        });
      });
    });
    context('Known Tag', function() {
      var validTag = 'TestEvent1';
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
  describe('#getSectorIEvents', function() {
    context('Invalid Sector', function() {
      var invalidSector = 99;
      it('should return an error and null', function(done) {
        IEvent.getSectorIEvents(invalidSector, function(err, ret) {
          assert.isNotNull(err);
          assert.isNull(ret);
          done();
        });
      });
    });
    context('Unused Sector', function() {
      var unknownSector = '1234567890';
      it('should return no error and null', function (done) {
        IEvent.getSectorIEvents(unknownSector, function(err, ret) {
          assert.isNull(err);
          assert.isNull(ret);
          done();
        });
      });
    });
    context('Used Sector', function() {
      var validSector = '123456789';
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
