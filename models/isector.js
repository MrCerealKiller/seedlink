/**
* @file Model for Devices as stored on the database
* @author Jeremy Mallette
* @version 0.0.0
* @module Models/Event
*/

// Imports ---------------------------------------------------------------------
const mongoose  = require('mongoose');

// Create Models ---------------------------------------------------------------
const iSectorSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    dropDups: true
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
    max: [54, 'Even an Arduino Mega doesn\'t have that many pins...']
  },
  overrideThresh: {
    type: Number,
    required: false
  },
  oSectors: [{
    type: Schema.Types.ObjectId,
    ref: 'OutputSector'
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
  sector.save(callback);
};

// Update Event ----------------------------------------------------------------
module.exports.updateISector = function(sector, callback) {
  ISector.findById(sector._id, function(err, dbSector) {
    if (err) {
      throw err;
    }

    dbSector.name = sector.name;
    dbSector.type = sector.type;
    dbSector.key = sector.key;
    dbSector.overrideThresh = sector.overrideThresh;
    dbSector.oSectors = sector.oSectors;

    dbSector.save(callback);
  });
};

// Remove Event ----------------------------------------------------------------
module.exports.removeISectorById = function(id, callback) {
  ISector.findById(id, function(err, sector) {
    if (err) {
      throw err;
    }

    sector.remove(callback);
  });
};
