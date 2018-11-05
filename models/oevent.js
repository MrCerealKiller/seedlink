/**
 * @file Model for Output Events as stored on the database
 * @author Jeremy Mallette
 * @version 0.0.0
 * @module Models/OutputSectorEvent
 */

// Imports ---------------------------------------------------------------------
const mongoose  = require('mongoose');

// Create Models ---------------------------------------------------------------
const oEventSchema = mongoose.Schema({
  sector: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'OutputSector',
    required: true
  },
  tag: {
    type: String,
    required: true,
    trim: true,
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

const OEvent = module.exports = mongoose.model('OutputEvent', oEventSchema);

// Get SectorEvents ------------------------------------------------------------
module.exports.getOEventById = function(id, callback) {
  OEvent.findById(id, callback);
};

module.exports.getOEventByTag = function(tag, callback) {
  var query = {tag: tag};
  OEvent.findOne(query, callback);
};

module.exports.getOEvents = function(sector, callback) {
  var query = {sector: sector};
  OEvent.find(query, callback);
}

// Add SectorEvent -------------------------------------------------------------
module.exports.addOEvent = function(oEvent, callback) {
  oEvent.save(callback);
};

// Update SectorEvent ----------------------------------------------------------
 module.exports.updateOEvent = function(oEvent, callback) {
  OEvent.findById(oEvent._id, function(err, dbOEvent) {
    if (err) {
      throw err;
    }

    dbOEvent.tag = oEvent.tag;
    dbOEvent.start = oEvent.start;
    dbOEvent.duration = oEvent.duration;
    dbOEvent.interval = oEvent.interval;

    dbOEvent.save(callback);
  });
};

// Remove SectorEvent ----------------------------------------------------------
module.exports.removeOEventById = function(id, callback) {
  OEvent.findById(id, function(err, oEvent) {
    if (err) {
      throw err;
    }

    oEvent.remove(callback);
  });
};
