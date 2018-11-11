/**
* @file Model for Input Sectors as stored on the database
* @author Jeremy Mallette
* @version 0.0.0
* @module Models/InputSector
*/

// Imports ---------------------------------------------------------------------
const mongoose  = require('mongoose');
const System    = require('./system');
const IEvent    = require('./ievent');

// Create Models ---------------------------------------------------------------
const iSectorSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    dropDups: true
  },
  system: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'System',
    required: true
  },
  type: {
    type: String,
    required: true,
    trim: true,
    default: 'Moisture',
    enum: [
      'Moisture',
      'Temperature',
      'Humidity',
      'pH'
    ]
  },
  key: {
    type: Number,
    required: true,
    min: [0, 'The key must be 0 or higher'],
    max: [54, 'Even an Arduino Mega doesn\'t have that many pins...'],
    unique: true,
    dropDups: true
  },
  iEvents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InputEvent'
  }]
}, {timestamps: true});

const ISector = module.exports = mongoose.model('InputSector', iSectorSchema);

// Get Sector ------------------------------------------------------------------
module.exports.getISectorById = function(id, callback) {
  ISector.findById(id, callback);
};

module.exports.getISectorByName = function(name, callback) {
  var query = {name: name};
  ISector.findOne(query, callback);
};

module.exports.getISectorsByType = function(type, callback) {
  var query = {type: type};
  ISector.find(query, callback);
}

// Add Sector ------------------------------------------------------------------
module.exports.addISector = function(sector, callback) {
  sector.save(function(err, sector) {
    if (err) {
      callback(err, null);

    } else if (sector == null) {
      callback(null, null);

    } else {
      // Add the id to the system input sectors
      ISector.findOne(sector).populate('system').exec(function(err, sector) {
        if (err) {
          callback(err, null);

        } else if (sector == null) {
          callback(null, null);

        } else {
          sector.system.inputSectors.push(sector._id);
          sector.system.save(function(err, system) {
            if (err) {
              callback(err, null);

            } else {
              callback(null, sector);
            }
          });
        }
      });
    }
  });
};

// Update Sector ---------------------------------------------------------------
module.exports.updateISector = function(sector, callback) {
  ISector.findById(sector._id, function(err, dbSector) {
    if (err) {
      callback(err, null);

    } else if (dbSector == null) {
      callback(null, null);

    } else {
      dbSector.name = sector.name;
      dbSector.type = sector.type;
      dbSector.key = sector.key;
      dbSector.iEvents = sector.iEvents;

      dbSector.save(callback);
    }
  });
};

// Remove Sector ---------------------------------------------------------------
module.exports.detachISectorById = function(id, callback) {
  ISector.getISectorById(id, function(err, sector) {
    if (err) {
      callback(err, null);

    } else if (sector == null) {
      callback(null, null);

    } else {
      // Remove the sector from the system input sector array
      ISector.findOne(sector).populate('system').exec(function(err, sector) {
        if (err) {
          callback(err, null);

        } else if (sector == null) {
          callback(null, null);

        } else {
          var idx = sector.system.inputSectors.indexOf(sector._id);
          if (idx > -1) {
            sector.system.inputSectors.splice(idx, 1);
            sector.system.save(function(err, system) {
              if (err) {
                callback(err, null);
              } else {
                callback(null, sector);
              }
            });
          } else {
            callback(new Error('sector is not listed in the system', null));
          }
        }
      });
    }
  });
};

module.exports.removeISectorById = function(id, callback) {
  ISector.findById(id, function(err, sector) {
    if (err) {
      callback(err, null);

    } else if (sector == null) {
      callback(null, null);

    } else {
      // Remove all of the child input events
      // and remove their reference from their input sector
      var query = {_id: sector._id};
      ISector.findOne(query).populate('iEvents').exec(function(err, sector) {
        if (err) {
          throw err;
        }

        sector.iEvents.forEach(function(iEvent) {
          IEvent.findOne(iEvent).populate('target').exec(function(err, iEvent) {
            var idx = iEvent.target.iEvents.indexOf(iEvent._id);
            if (idx > -1) {
              iEvent.target.iEvents.splice(idx, 1);
              iEvent.target.save(function(err, iEvent) {
                if (err) {
                  throw err;
                }
              });
            }
          });

          IEvent.removeIEventById(iEvent._id, function(err) {
            if (err) {
              throw err;
            }
          });
        });
        sector.remove(callback);
      });
    }
  });
};
