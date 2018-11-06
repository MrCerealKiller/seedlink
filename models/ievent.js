/**
 * @file Model for Output Events as stored on the database
 * @author Jeremy Mallette
 * @version 0.0.0
 * @module Models/InputSectorEvent
 */

// Imports ---------------------------------------------------------------------
const mongoose  = require('mongoose');

// Create Models ---------------------------------------------------------------
const iEventSchema = mongoose.Schema({
  sector: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InputSector',
    required: true
  },
  tag: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    dropDups: true
  },
  threshold: {
    type: Number,
    required: false
  },
  duration: {
    type: Number,
    required: true,
    min: [0, 'Duration must be entered in seconds'],
    max: [36000, 'Please keep the duration less than 10 hrs']
  },
}, {timestamps: true});

const IEvent = module.exports = mongoose.model('InputEvent', iEventSchema);

// Get Events ------------------------------------------------------------------
module.exports.getIEventById = function(id, callback) {
  IEvent.findById(id, callback);
};

module.exports.getIEventByTag = function(tag, callback) {
  var query = {tag: tag};
  IEvent.findOne(query, callback);
};

module.exports.getSectorIEvents = function(sector, callback) {
  var query = {sector: sector};
  IEvent.find(query, callback);
};

// Add Event -------------------------------------------------------------------
module.exports.addIEvent = function(iEvent, callback) {
  iEvent.save(callback);
};

// Update Event ----------------------------------------------------------------
 module.exports.updateIEvent = function(iEvent, callback) {
  IEvent.findById(iEvent._id, function(err, dbIEvent) {
    if (err) {
      callback(err, null);

    } else if (dbIEvent == null) {
      callback(null, null);

    } else {
      dbIEvent.tag = iEvent.tag;
      dbIEvent.start = iEvent.start;
      dbIEvent.duration = iEvent.duration;
      dbIEvent.interval = iEvent.interval;

      dbIEvent.save(callback);
    }
  });
};

// Remove Event ----------------------------------------------------------------
module.exports.removeIEventById = function(id, callback) {
  IEvent.findById(id, function(err, iEvent) {
    if (err) {
      callback(err, null);

    } else if (iEvent == null) {
      callback(null, null);

    } else {
      iEvent.remove(callback);      
    }
  });
};
