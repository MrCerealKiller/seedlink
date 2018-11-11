/**
 * @file Test Root
 * @author Jeremy Mallette
 * @version 0.0.0
 * @module Test/Root
 */

// Imports ---------------------------------------------------------------------
const mongoose = require('mongoose');
const bluebird = require('bluebird');

// Local Dependencies ----------------------------------------------------------
const db = require('../config/database'); // Development configuration

// Before All ------------------------------------------------------------------
before('Pretty Print', function() {
  console.log('\033[95m' + '\033[92m' + '\033[1m' +
              'Seedlink Backend Test Suite\n' + '\033[0m');
  console.log('\033[2m' +
              'The teseting suite for the models is missing coverage for\n' +
              'MongoDB unique property validation, because it is\n' +
              'inconsistent. However, this is fine because it is a third-\n' +
              'party API, not a critical feature, and seems to work fine in\n' +
              'the application itself.\n' + '\033[0m');
});

before('Connecting to test database', function(done) {
  // Connect to the database
  mongoose.Promise = bluebird;
  mongoose.connect((process.env.MONGO_URL || db.url) + db.test_database,
                   db.opts);

  mongoose.connection.on('connected', function() {
      console.log('Sucessfully connected to database\n');
      done();
  });

  mongoose.connection.on('error', function(err) {
      throw new Error('Error connecting to database\nError: ' + err + '\n');
      done()
  });
});

// Clear collections before each component -------------------------------------
beforeEach('Clear Database', function(done) {
  const iEvents = mongoose.connection.collections.inputevents;
  const iSectors = mongoose.connection.collections.inputsectors;
  const oEvents = mongoose.connection.collections.outputevents;
  const oSectors = mongoose.connection.collections.outputsectors;
  const systems = mongoose.connection.collections.systems;

  iEvents.drop(function() {
    iSectors.drop(function() {
      oEvents.drop(function() {
        oSectors.drop(function() {
          systems.drop(function() {
            done();
          });
        });
      });
    });
  });
});
