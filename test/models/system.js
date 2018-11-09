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

  // Get system by ID -----------------------------------------------------------
  describe('#getSytemById', function() {
    context('Invalid ID', function() {
      var invalidId = 99;
      it('should return an error and null', function(done) {
        System.getSystemById(invalidId, function(err, ret) {
          assert.isNotNull(err);
          assert.isNull(ret);
          done();
        });
      });
    });
    context('Unknown ID', function() {
      var unknownId = '5092428t0985';
      it('should return no error and null', function (done) {
        System.getSystemById(unknownId, function(err, ret) {
          assert.isNull(err);
          assert.isNull(ret);
          done();
        });
      });
    });
    context('Known ID', function() {
      var validId = '248957239087';
      it('should return no error and an System object', function(done) {
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

  // Get System by name --------------------------------------------------------
  describe('#getSystemByName', function() {
    var invalidName = 99;
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
      var unknownName = 'Unkown Name';
      it('should return no error and null', function (done) {
        System.getSystemByName(unknownName, function(err, ret) {
          assert.isNull(err);
          assert.isNull(ret);
          done();
        });
      });
    });
    context('Known Name', function() {
      var validName = 'TestSystem1';
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

  // Get all systems -----------------------------------------------------------
  describe('#getAllSystems', function() {
    context('No Error', function() {
      it('should return no error and a list of System objects', function(done) {
        System.getAllSystems(function(err, ret) {
          assert.isNull(err);
          assert.isNotNull(ret);
          assert.isArray(ret);
          ret.forEach(function(item) {
            assert.instanceOf(item, System);
          });
          done();
        });
      });
    });
  });
});
