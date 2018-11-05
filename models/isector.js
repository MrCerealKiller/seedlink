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

module.exports.getSectorsByType = function(type, callback) {
  var query = {type: type};
  ISector.find(query, callback);
}

// Add Event -------------------------------------------------------------------
module.exports.addISector = function(sector, callback) {
  sector.save(function(err, sector) {
    if (err || sector == null) {
      callback(err, null);
      return;
    }

    var callbackErr = false;

    // Add the id to the system input sectors
    ISector.findOne(sector).populate('system').exec(function(err, sector) {
      if (err || sector == null || sector == undefined) {
        callbackErr = true;
      }

      sector.system.inputSectors.push(sector._id);
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
module.exports.updateISector = function(sector, callback) {
  ISector.findById(sector._id, function(err, dbSector) {
    if (err || dbSector == null) {
      callback(err, null);
      return;
    }

    dbSector.name = sector.name;
    dbSector.type = sector.type;
    dbSector.key = sector.key;
    dbSector.iEvents = sector.iEvents;

    dbSector.save(callback);
  });
};

// Remove Event ----------------------------------------------------------------
module.exports.detachISectorById = function(id, callback) {
  ISector.getISectorById(id, function(err, sector) {
    if (err || sector == null) {
      callback(err, null);
      return;
    }

    var callbackErr = false;

    // Remove the sector from the system input sector array
    ISector.findOne(sector).populate('system').exec(function(err, sector) {
      if (err || sector == null) {
        callbackErr = true;
        return;
      }

      var idx = sector.system.inputSectors.indexOf(sector._id);
      if (idx > -1) {
        sector.system.inputSectors.splice(idx, 1);
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

module.exports.removeISectorById = function(id, callback) {
  ISector.findById(id, function(err, sector) {
    if (err) {
      throw err;
    }

    // Remove all of the child events
    sector.iEvents.forEach(function(iEvent) {
      IEvent.removeIEventById(iEvent, function(err) {
        if (err) {
          throw err;
        }
      });
    });

    sector.remove(callback);
  });
};
