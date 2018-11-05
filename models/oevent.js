/**
 * @file Model for Output Events as stored on the database
 * @author Jeremy Mallette
 * @version 0.0.0
 * @module Models/SectorEvent
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

const OSectorEvent = module.exports = mongoose.model('OSectorEvent', oEventSchema);

// Get SectorEvents ------------------------------------------------------------
module.exports.getOSectorEventById = function(id, callback) {
  SectorEvent.findById(id, callback);
};

module.exports.getOSectorEventByTag = function(tag, callback) {
  var query = {tag: tag};
  SectorEvent.findOne(query, callback);
};

module.exports.getOSectorsEvents = function(sector, callback) {
  var query = {sector: sector};
  SectorEvent.find(query, callback);
}

// Add SectorEvent -------------------------------------------------------------
module.exports.addOSectorEvent = function(sectorEvent, callback) {
  sectorEvent.save(callback);
};

// Update SectorEvent ----------------------------------------------------------
 module.exports.updateOSectorEvent = function(sectorEvent, callback) {
  SectorEvent.findById(sectorEvent._id, function(err, dbSectorEvent) {
    if (err) {
      throw err;
    }

    dbSectorEvent.tag = sectorEvent.tag;
    dbSectorEvent.start = sectorEvent.start;
    dbSectorEvent.duration = sectorEvent.duration;
    dbSectorEvent.interval = sectorEvent.interval;

    dbSectorEvent.save(callback);
  });
};

// Remove SectorEvent ----------------------------------------------------------
module.exports.removeOSectorEventById = function(id, callback) {
  SectorEvent.findById(id, function(err, sectorEvent) {
    if (err) {
      throw err;
    }

    sectorEvent.remove(callback);
  });
};
