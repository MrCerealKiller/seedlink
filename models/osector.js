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

// Add Event -------------------------------------------------------------------
module.exports.addOSector = function(sector, callback) {
  sector.save(function(err, sector) {
    if (err) {
      throw err;
    }

    var callbackErr = false;

    // Add the id to the system input sectors
    OSector.findOne(sector).populate('system').exec(function(err, sector) {
      if (err || sector == null || sector == undefined) {
        callbackErr = true;
      }

      sector.system.outputSectors.push(sector._id);
      sector.system.save(function(err, system) {
        if (err) {
          callbackErr = true;
        }
      });
    });

    if (callbackErr) {
      callback(new Error('could not link sector to system'), null);
    } else {
      callback(null, sector);
    }
  });
};

// Update Event ----------------------------------------------------------------
module.exports.updateOSector = function(sector, callback) {
  OSector.findById(sector._id, function(err, dbSector) {
    if (err) {
      throw err;
    }

    dbSector.name = sector.name;
    dbSector.type = sector.type;
    dbSector.key = sector.key;
    dbSector.oEvents = sector.oEvents;

    dbSector.save(callback);
  });
};

// Remove Event ----------------------------------------------------------------
module.exports.detachOSectorById = function(id, callback) {
  OSector.getOSectorById(id, function(err, sector) {
    if (err) {
      throw err;
    }

    var callbackErr = false;

    // Remove the sector from the system input sector array
    OSector.findOne(sector).populate('system').exec(function(err, sector) {
      if (err) {
        throw err;
      }

      var idx = sector.system.outputSectors.indexOf(sector._id);
      if (idx > -1) {
        sector.system.outputSectors.splice(idx, 1);
        sector.system.save(function(err, system) {
          if (err) {
            callbackErr = true;
          }
        });
      } else {
        callbackErr = true;
      }
    });

    if (callbackErr) {
      callback(new Error('could not delete sector from system'), null);
    } else {
      callback(null, sector);
    }
  });
};

module.exports.removeOSectorById = function(id, callback) {
  OSector.findById(id, function(err, sector) {
    if (err) {
      throw err;
    }

    sector.remove(callback);
  });
};
