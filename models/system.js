/**
* @file Model for the System as stored on the database
* @author Jeremy Mallette
* @version 0.0.0
* @module Models/OutputSector
*/

// Imports -----------------------------------------------------------------------------
const mongoose  = require('mongoose');
const ISector = require('./isector');
const OSector = require('./osector');

// Create Models -----------------------------------------------------------------------
const systemSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    dropDups: true
  },
  passcode: {
    type: String,
    required: true,
    trim: true,
  },
  inputPort: {
    type: String,
    required: true,
    trim: true
  },
  inputSectors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InputSector'
  }],
  outputPort: {
    type: String,
    required: true,
    trim: true
  },
  outputSectors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'OutputSector'
  }],
  tempWarning: {
    type: Number
  },
  tempCritical: {
    type: Number
  },
  humidityWarning: {
    type: Number
  },
  humidityCritical: {
    type: Number
  },
  pHWarning: {
    type: Number
  },
  pHCritical: {
    type: Number
  },
  waterLevelWarning: {
    type: Number
  },
  waterLevelCritical: {
    type: Number
  },
}, {timestamps: true});

const System = module.exports = mongoose.model('System', systemSchema);

// Get System --------------------------------------------------------------------------
module.exports.getSystemById = function(id, callback) {
  System.findById(id, callback);
};

module.exports.getSystemByName = function(name, callback) {
  var query = {name: name};
  System.findOne(query, callback);
};

module.exports.getAllSystems = function(callback) {
  System.find(callback);
};

// Add System --------------------------------------------------------------------------
module.exports.addSystem = function(system, callback) {
  system.save(callback);
};

// Update System -----------------------------------------------------------------------
module.exports.updateSystem = function(system, callback) {
  System.findById(system._id, function(err, dbSystem) {
    if (err) {
      callback(err, null);

    } else if (dbSystem == null) {
      callback(null, null);

    } else {
      dbSystem.name = system.name;
      dbSystem.passcode = system.passcode;
      dbSystem.inputPort = system.inputPort;
      dbSystem.inputSectors = system.inputSectors;
      dbSystem.outputPort = system.outputPort;
      dbSystem.outputSectors = system.outputSectors
      dbSystem.tempWarning = system.tempWarning;
      dbSystem.tempCritical = system.tempCritical;
      dbSystem.humidityWarning = system.humidityWarning;
      dbSystem.humidityCritical = system.humidityCritical;
      dbSystem.pHWarning = system.pHWarning;
      dbSystem.pHCritical = system.pHCritical;
      dbSystem.waterLevelWarning = system.waterLevelWarning;
      dbSystem.waterLevelCritical = system.waterLevelCritical;

      dbSystem.save(callback);
    }
  });
};

// Remove System -----------------------------------------------------------------------
module.exports.removeSystemById = function(id, callback) {
  System.findById(id, function(err, system) {
    if (err) {
      callback(err, null);

    } else if (system == null) {
      callback(null, null);

    } else {
      // Remove all of the children input sectors
      system.inputSectors.forEach(function(sector) {
        console.log(ISector == null || ISector == undefined);
        ISector.getISectorById(sector, function(err) {
          if (err) {
            throw err;
          }
        });
      });

      // Remove all of the children output sectors
      system.outputSectors.forEach(function(sector) {
        OSector.removeOSectorById(sector, function(err) {
          if (err) {
            throw err;
          }
        });
      });

      system.remove(callback);
    }
  });
};
