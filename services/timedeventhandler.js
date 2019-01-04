/**
 * @file Timed-Event Handler
 * @author Jeremy Mallette
 * @version 0.0.0
 * @module Services/TimedEventHandler
 */

// Imports ---------------------------------------------------------------------
const schedule = require('node-schedule');

// Local Dependencies ----------------------------------------------------------
const db_config = require('../config/database.js');
const System    = require('../models/system');
const OEvent    = require('../models/oevent');

// Global Variables ------------------------------------------------------------
var jobs = {};

// Load Jobs from the Database -------------------------------------------------
module.exports.loadDbJobs = function(id) {
  System.getSystemById(id, function(err, system) {
    if (err) {
      console.error('Error:\n' + err);
    } else if (systems == null) {
      console.error('Error - System wasn\'t found');
    } else {
      system.outputSectors.forEach(function(sector) {
        OEvent.getSectorOEvents(sector, function(err, events) {
          if (err) {
            console.error('Error:\n' + err);
          } else if (systems == null) {
            console.error('Error - No events were found');
          } else {
            events.forEach(function(e) {
              createJob(e.tag, e.dayOfWeek, e.hour, e.minute, e.duration);
            });
          }
        });
      });
    }
  });
};

// Schedule a Job --------------------------------------------------------------
module.exports.createJob = function(key, dayOfWeek, hour, minute, duration) {
  var rule = new schedule.RecurrenceRule();

  // Set the recurrence rule:
  // Day of week, hour, and minute are the priority for this system
  rule.dayOfWeek = dayOfWeek;
  rule.hour = hour;
  rule.minute = minute;

  var job = schedule.scheduleJob(rule, function(){
    /**
     *
     * Eventually put method logic here
     *
     */
    console.log('Test: ' + key);
  });

  jobs[key] = job;
};

// Cancel a Job ----------------------------------------------------------------
module.exports.cancelJob = function(key) {
  jobs[key].cancel();
};
