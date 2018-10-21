/**
 * @file Model for Devices as stored on the database
 * @author Jeremy Mallette
 * @version 0.0.0
 * @module Models/Event
 */

// Imports ---------------------------------------------------------------------
const mongoose  = require('mongoose');
const db        = require('../config/database.js');

// Create Models ---------------------------------------------------------------
const eventSchema = mongoose.Schema({
  sector: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
    required: true,
    unique: true,
    dropDups: true
  },
  start: {
    type: Number,
    required: true,
    min: [0, 'The start must be greater than 00:00:00'],
    max: [86400, 'The start time must not exceed a day']
  },
  duration: {
    type: Number,
    required: true,
    min: [0, 'Duration must be entered in seconds'],
    max: [36000, 'Please keep the duration less than 10 hrs']
  },
  interval: {
    type: Number,
    required: true,
    min: [1, 'The interval must be at least one day'],
    max: [7, 'The interval cannot exceed a week']
  }
}, {timestamps: true});

const Event = module.exports = mongoose.model('Event', eventSchema);

// Get Events ------------------------------------------------------------------
module.exports.getEventById = function(id, callback) {
  Event.findById(id, callback);
};

module.exports.getDeviceByTag = function(tag, callback) {
  var query = {tag: tag};
  Event.findOne(query, callback);
};

module.exports.getSectorEvents = function(sector, callback) {
  var query = {sector: sector};
  Event.find(query, callback);
}

// Add Event -------------------------------------------------------------------
module.exports.addEvent = function(ev, callback) {
  ev.save(callback);
};

// Update Event ----------------------------------------------------------------
 module.exports.updateEvent = function(ev, callback) {
  Event.findById(ev._id, function(err, dbEvent) {
    if (err) {
      throw err;
    }

    dbEvent.sector = ev.sector;
    dbEvent.tag = ev.cid;
    dbEvent.start = ev.start;
    dbEvent.duration = ev.duration;
    dbEvent.interval = ev.interval;

    dbEvent.save(callback);
  });
};

// Remove Event ----------------------------------------------------------------
module.exports.removeEventById = function(id, callback) {
  Event.findById(id, function(err, ev) {
    if (err) {
      throw err;
    }

    ev.remove(callback);
  });
};
