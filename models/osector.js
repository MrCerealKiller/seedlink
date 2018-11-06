/**
* @file Model for Output Sectors as stored on the database
* @author Jeremy Mallette
* @version 0.0.0
* @module Models/OutputSector
*/

// Imports ---------------------------------------------------------------------
const mongoose = require('mongoose');
const System   = require('./system');
const OEvent   = require('./oevent');
const IEvent   = require('./ievent');

// Create Models ---------------------------------------------------------------
const oSectorSchema = mongoose.Schema({
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
    default: 'Water',
    enum: [
      'Water',
      'Lights',
      'Fans',
      'Recirculating'
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
  oEvents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'OutputEvent'
  }],
  iEvents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InputEvent'
  }]
}, {timestamps: true});

const OSector = module.exports = mongoose.model('OutputSector', oSectorSchema);

// Get Sector ------------------------------------------------------------------
module.exports.getOSectorById = function(id, callback) {
  OSector.findById(id, callback);
};

module.exports.getOSectorByName = function(name, callback) {
  var query = {name: name};
  OSector.findOne(query, callback);
};

module.exports.getSectorsByType = function(type, callback) {
  var query = {type: type};
  OSector.find(query, callback);
}

// Add Sector ------------------------------------------------------------------
module.exports.addOSector = function(sector, callback) {
  sector.save(function(err, sector) {
    if (err) {
      callback(err, null);

    } else if (sector == null) {
      callback(null, null);

    } else {
      // Add the id to the system output sectors
      OSector.findOne(sector).populate('system').exec(function(err, sector) {
        if (err || sector == null) {
          callback(err, null);

        } else {
          sector.system.outputSectors.push(sector._id);
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
module.exports.updateOSector = function(sector, callback) {
  OSector.findById(sector._id, function(err, dbSector) {
    if (err) {
      callback(err, null);

    } else if (dbSector == null) {
      callback(null, null);

    } else {
      dbSector.name = sector.name;
      dbSector.type = sector.type;
      dbSector.key = sector.key;
      dbSector.oEvents = sector.oEvents;
      dbSector.iEvents = sector.iEvents;

      dbSector.save(callback);
    }
  });
};

// Remove Sector ---------------------------------------------------------------
module.exports.detachOSectorById = function(id, callback) {
  OSector.getOSectorById(id, function(err, sector) {
    if (err) {
      callback(err, null);

    } else if (sector == null) {
      callback(null, null);

    } else {
      // Remove the sector from the system input sector array
      OSector.findOne(sector).populate('system').exec(function(err, sector) {
        if (err) {
          callback(err, null);

        } else if (sector == null) {
          callback(null, null);

        } else {
          var idx = sector.system.outputSectors.indexOf(sector._id);
          if (idx > -1) {
            sector.system.outputSectors.splice(idx, 1);
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

module.exports.removeOSectorById = function(id, callback) {
  OSector.findById(id, function(err, sector) {
    if (err) {
      callback(err, null);

    } else if (sector == null) {
      callback(null, null);

    } else {
      // Remove all of the child output events
      sector.oEvents.forEach(function(oEvent) {
        OEvent.removeOEventById(oEvent, function(err) {
          if (err) {
            throw err;
          }
        });
      });

      // Remove all of the child input events
      // and remove their reference from their input sector
      var query = {_id: sector._id};
      OSector.findOne(query).populate('iEvents').exec(function(err, sector) {
        if (err) {
          throw err;
        }

        sector.iEvents.forEach(function(iEvent) {
          IEvent.findOne(iEvent).populate('sector').exec(function(err, iEvent) {
            var idx = iEvent.sector.iEvents.indexOf(iEvent._id);
            if (idx > -1) {
              iEvent.sector.iEvents.splice(idx, 1);
              iEvent.sector.save(function(err, iEvent) {
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
