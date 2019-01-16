/**
 * @file Model for Timed Events as stored on the database
 * @author Jeremy Mallette
 * @version 0.0.0
 * @module Models/TimedEvent
 */

// Imports ---------------------------------------------------------------------
const mongoose  = require('mongoose');

// Create Models ---------------------------------------------------------------
const tEventSchema = mongoose.Schema({
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
  schedule: {
    dayOfWeek: {
      type: [Number],
      required: true
    },
    hour: {
      type: Number,
      required: true,
      min: [0, 'Please input an hour between 0 and 24'],
      max: [24, 'Please input an hour between 0 and 24']
    },
    minute: {
      type: Number,
      required: true,
      min: [0, 'Please input a minute between 0 and 60'],
      max: [60, 'Please input a minute between 0 and 60']
    },
  },
  duration: {
    type: Number,
    required: true,
    min: [0, 'Duration must be entered in seconds'],
    max: [36000, 'Please keep the duration less than 10 hrs']
  },
}, {timestamps: true});

const TEvent = module.exports = mongoose.model('TimedEvent', tEventSchema);

// Get Events ------------------------------------------------------------------
module.exports.getTEventById = function(id, callback) {
  TEvent.findById(id, callback);
};

module.exports.getTEventByTag = function(tag, callback) {
  var query = {tag: tag};
  TEvent.findOne(query, callback);
};

module.exports.getSectorTEvents = function(sector, callback) {
  var query = {sector: sector};
  TEvent.find(query, callback);
};

// Add Event -------------------------------------------------------------------
module.exports.addTEvent = function(tEvent, callback) {
  tEvent.save(function(err, tEvent) {
    if (err) {
      callback(err, null);

    } else if (tEvent == null) {
      callback(null, null);

    } else {
      // Add the id to the output sectors events
      TEvent.findOne(tEvent).populate('sector').exec(function(err, tEvent) {
        if (err) {
          callback(err, null);

        } else if (tEvent == null) {
          callback(null, null);

        } else {
          tEvent.sector.tEvents.push(tEvent._id);
          tEvent.sector.save(function(err, sector) {
            if (err) {
              callback(err, null);
            } else {
              callback(null, tEvent);
            }
          });
        }
      });
    }
  });
};

// Update Event ----------------------------------------------------------------
 module.exports.updateTEvent = function(tEvent, callback) {
  TEvent.findById(tEvent._id, function(err, dbTEvent) {
    if (err) {
      callback(err, null);

    } else if (dbTEvent == null) {
      callback(null, null);

    } else {
      dbTEvent.tag = tEvent.tag;
      dbTEvent.schedule = tEvent.schedule;
      dbTEvent.duration = tEvent.duration;

      dbTEvent.save(callback);
    }
  });
};

// Remove Event ----------------------------------------------------------------
module.exports.detachTEventById = function(id, callback) {
  TEvent.getTEventById(id, function(err, tEvent) {
    if (err) {
      callback(err, null);

    } else if (tEvent == null) {
      callback(null, null);

    } else {
      // Remove the event from the sector
      TEvent.findOne(tEvent).populate('sector').exec(function(err, tEvent) {
        if (err) {
          callback(err, null);

        } else if (tEvent == null) {
          callback(null, null);

        } else {
          var idx = tEvent.sector.tEvents.indexOf(tEvent._id);
          if (idx > -1) {
            tEvent.sector.tEvents.splice(idx, 1);
            tEvent.sector.save(function(err, sector) {
              if (err) {
                callback(err, null);
              } else {
                callback(null, tEvent);
              }
            });
          } else {
            callback(new Error('event is not listed in the sector', null));
          }
        }
      });
    }
  });
};

module.exports.removeTEventById = function(id, callback) {
  TEvent.findById(id, function(err, tEvent) {
    if (err) {
      callback(err, null);

    } else if (tEvent == null) {
      callback(null, null);

    } else {
      tEvent.remove(callback);
    }
  });
};
