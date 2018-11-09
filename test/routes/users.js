// Dependencies ----------------------------------------------------------------
const bluebird      = require('bluebird');
const mongoose      = require('mongoose');

// Local Dependencies ----------------------------------------------------------
const router = require('../../routes/users');
const db     = require('../../config/database'); // Development configuration

// Aserrtions ------------------------------------------------------------------
var assert = require('chai').assert;

// Tests -----------------------------------------------------------------------
describe('Users Router', function() {

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

  describe('System Requests', function() {
    // TODO
  });

  describe('Input Sector Requests', function() {
    // TODO
  });

  describe('Output Sector Requests', function() {
    // TODO
  });

  describe('Input Events Requests', function() {
    // TODO
  });

  describe('Output Events Requests', function() {
    // TODO
  });
});
