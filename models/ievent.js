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
  target: {
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
  threshold: {
    type: Number,
    required: false
  },
  duration: {
    type: Number,
    required: false,
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
  iEvent.save(function(err, iEvent) {
    if (err) {
      callback(err, null);

    } else if (iEvent == null) {
      callback(null, null);

    } else {
      // Add the id to the system input and output sectors
      IEvent.findOne(iEvent)
            .populate('sector')
            .populate('target')
            .exec(function(err, iEvent) {
        if (err) {
          callback(err, null);

        } else if (iEvent == null) {
          callback(null, null);

        } else {
          iEvent.sector.iEvents.push(iEvent._id);
          iEvent.sector.save(function(err, sector) {
            if (err) {
              callback(err, null);
            } else {
              iEvent.target.iEvents.push(iEvent._id);
              iEvent.target.save(function(err, sector) {
                if (err) {
                  callback(err, null);
                } else {
                  callback(null, iEvent)
                }
              });
            }
          });
        }
      });
    }
  });
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
      dbIEvent.threshold = iEvent.threshold;
      dbIEvent.duration = iEvent.duration;

      dbIEvent.save(callback);
    }
  });
};

// Remove Event ----------------------------------------------------------------
module.exports.detachIEventById = function(id, callback) {
  IEvent.getIEventById(id, function(err, iEvent) {
    if (err) {
      callback(err, null);

    } else if (iEvent == null) {
      callback(null, null);

    } else {
      // Remove the event from the both the sectors
      IEvent.findOne(iEvent)
            .populate('sector')
            .populate('target')
            .exec(function(err, iEvent) {
        if (err) {
          callback(err, null);

        } else if (iEvent == null) {
          callback(null, null);

        } else {
          var sidx = iEvent.sector.iEvents.indexOf(iEvent._id);
          if (sidx > -1) {
            iEvent.sector.iEvents.splice(sidx, 1);
            iEvent.sector.save(function(err, sector) {
              if (err) {
                callback(err, null);
              } else {
                var tidx = iEvent.target.iEvents.indexOf(iEvent._id);
                if (tidx > -1) {
                  iEvent.target.iEvents.splice(tidx, 1);
                  iEvent.target.save(function(err, sector) {
                    if (err) {
                      callback(err, null);
                    } else {
                      callback(null, iEvent);
                    }
                  });
                } else {
                  callback(new Error('event is not listed in target', null));
                }
              }
            });
          } else {
            callback(new Error('event is not listed in sector', null));
          }
        }
      });
    }
  });
};

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
