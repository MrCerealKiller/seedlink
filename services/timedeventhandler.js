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
const TEvent    = require('../models/tevent');

// Global Variables ------------------------------------------------------------
var jobs = {};

// Load Jobs from the Database -------------------------------------------------
module.exports.initDbJobs = function(id) {
  System.getSystemById(id, function(err, system) {
    if (err) {
      console.error('Error:\n' + err);
    } else if (system == null) {
      console.error('Error - System wasn\'t found');
    } else {
      system.outputSectors.forEach(function(sector) {
        var key = sector.key;
        TEvent.getSectorTEvents(sector, function(err, events) {
          if (err) {
            console.error('Error:\n' + err);
          } else if (systems == null) {
            console.error('Error - No events were found');
          } else {
            events.forEach(function(e) {
              createJob(e.tag, key, e.schedule, e.duration);
            });
            console.log('Done');
          }
        });
      });
    }
  });
};

// Schedule a Job --------------------------------------------------------------
module.exports.createJob = function(tag, key, eSchedule, duration) {
  var rule = new schedule.RecurrenceRule();

  // Set the recurrence rule:
  // Day of week, hour, and minute are the priority for this system
  rule.dayOfWeek = eSchedule.dayOfWeek;
  rule.hour = eSchedule.hour;
  rule.minute = eSchedule.minute;

  var job = schedule.scheduleJob(rule, function() {
    /**
     *
     * Eventually put method logic here
     *
     */
    var ts = new Date().toLocaleString({ hour12: false});
    console.log('[' + ts + ']\t' + tag);
  });

  jobs[tag] = job;
};

// Cancel a Job ----------------------------------------------------------------
module.exports.cancelAllJobs = function() {
  jobs.forEach(function(job) {
    job.cancel();
  });
};

module.exports.cancelJob = function(tag) {
  jobs[tag].cancel();
};
