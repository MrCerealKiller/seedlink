/**
* @file Model for Devices as stored on the database
* @author Jeremy Mallette
* @version 0.0.0
* @module Models/Event
*/

// Imports ---------------------------------------------------------------------
const mongoose  = require('mongoose');

// Create Models ---------------------------------------------------------------
const oSectorSchema = mongoose.Schema({
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
    max: [54, 'Even an Arduino Mega doesn\'t have that many pins...']
  },
  events: [{
    type: Schema.Types.ObjectId,
    ref: 'SectorEvent'
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
  sector.save(callback);
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
    dbSector.events = sector.events;

    dbSector.save(callback);
  });
};

// Remove Event ----------------------------------------------------------------
module.exports.removeOSectorById = function(id, callback) {
  OSector.findById(id, function(err, sector) {
    if (err) {
      throw err;
    }

    sector.remove(callback);
  });
};
