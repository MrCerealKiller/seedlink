/**
 * @file Model for Output Events as stored on the database
 * @author Jeremy Mallette
 * @version 0.0.0
 * @module Models/SectorEvent
 */

// Imports ---------------------------------------------------------------------
const mongoose  = require('mongoose');

// Create Models ---------------------------------------------------------------
const eventSchema = mongoose.Schema({
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

const SectorEvent = module.exports = mongoose.model('SectorEvent', eventSchema);

// Get SectorEvents ------------------------------------------------------------
module.exports.getSectorEventById = function(id, callback) {
  SectorEvent.findById(id, callback);
};

module.exports.getSectorEventByTag = function(tag, callback) {
  var query = {tag: tag};
  SectorEvent.findOne(query, callback);
};

module.exports.getSectorsEvents = function(sector, callback) {
  var query = {sector: sector};
  SectorEvent.find(query, callback);
}

// Add SectorEvent -------------------------------------------------------------
module.exports.addSectorEvent = function(sectorEvent, callback) {
  sectorEvent.save(callback);
};

// Update SectorEvent ----------------------------------------------------------
 module.exports.updateSectorEvent = function(sectorEvent, callback) {
  SectorEvent.findById(sectorEvent._id, function(err, dbSectorEvent) {
    if (err) {
      throw err;
    }

    dbSectorEvent.sector = sectorEvent.sector;
    dbSectorEvent.tag = sectorEvent.tag;
    dbSectorEvent.start = sectorEvent.start;
    dbSectorEvent.duration = sectorEvent.duration;
    dbSectorEvent.interval = sectorEvent.interval;

    dbSectorEvent.save(callback);
  });
};

// Remove SectorEvent ----------------------------------------------------------
module.exports.removeSectorEventById = function(id, callback) {
  SectorEvent.findById(id, function(err, sectorEvent) {
    if (err) {
      throw err;
    }

    sectorEvent.remove(callback);
  });
};
