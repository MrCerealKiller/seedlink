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
const db     = require('../config/database'); // Development configuration

// Before All ------------------------------------------------------------------
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
  const collections = mongoose.connection.collections;
  done();
});
