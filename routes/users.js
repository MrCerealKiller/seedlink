/**
 * @file Secured backend routes
 * @author Jeremy Mallette
 * @version 0.0.0
 * @module Routes/Users
 * @see {@link module:Routes/Index} for unsecured routes
 */

// Imports ---------------------------------------------------------------------
const express = require('express');
const router = express.Router();

// Local Dependencies ----------------------------------------------------------
const db_config = require('../config/database.js');
const System    = require('../models/system');
const ISector   = require('../models/isector');
const OSector   = require('../models/osector');
const Event     = require('../models/oevent');

// System ----------------------------------------------------------------------
router.route('/system')
  .get(function(req, res, next) {
    getSystem(req,res);
  })
  .post(function(req, res, next) {
    addSystem(req, res);
  })
  .put(function(req, res, next) {
    updateSystem(req, res);
  })
  .delete(function(req, res, next) {
    deleteSystem(req, res);
  });

function getSystem(req, res) {
  var id = req.headers.id;

  if (id != null && id != undefined && id != "") {
    System.getSystemById(id, function(err, system) {
      if (err || system == null) {
        res.json({
          success: false,
          msg: ('Could not retrieve the system. Error: ' + err),
          system: undefined
        });
      } else {
        res.json({
          success: true,
          msg: 'Retrieved the requested system',
          system: system
        });
      }
    });
  } else {
    System.getAllSystems(function(err, systems) {
      if (err || systems == null) {
        res.json({
          success: false,
          msg: ('Could not retrieve systems or none defined. Error: ' + err),
          systems: undefined
        });
      } else {
        res.json({
          success: true,
          msg: 'Retrieved Seedlink systems',
          systems: systems
        });
      }
    });
  }
}

function addSystem(req, res) {
  var newSystem = new System({
    name: req.body.name,
    passcode: req.body.passcode,
    inputPort: req.body.inputPort,
    inputSectors: req.body.inputSectors,
    outputPort: req.body.outputPort,
    outputSectors: req.body.outputSectors,
    tempWarning: req.body.tempWarning,
    tempCritical: req.body.tempCritical,
    humidityWarning: req.body.humidityWarning,
    humidityCritical: req.body.humidityCritical,
    pHWarning: req.body.pHWarning,
    pHCritical: req.body.pHCritical,
    waterLevelWarning: req.body.waterLevelWarning,
    waterLevelCritical: req.body.waterLevelCritical
  });

  System.addSystem(newSystem, function(err, system) {
    if (err || system == null) {
      res.json({
        success: false,
        msg: 'Could not save the system. Error: ' + err
      });
    } else {
      res.json({
        success: true,
        msg: system.name + ' was saved.'
      });
    }
  });
}

function updateSystem(req, res) {
  var update = new System({
    _id: req.body._id,
    name: req.body.name,
    passcode: req.body.passcode,
    inputPort: req.body.inputPort,
    inputSectors: req.body.inputSectors,
    outputPort: req.body.outputPort,
    outputSectors: req.body.outputSectors,
    tempWarning: req.body.tempWarning,
    tempCritical: req.body.tempCritical,
    humidityWarning: req.body.humidityWarning,
    humidityCritical: req.body.humidityCritical,
    pHWarning: req.body.pHWarning,
    pHCritical: req.body.pHCritical,
    waterLevelWarning: req.body.waterLevelWarning,
    waterLevelCritical: req.body.waterLevelCritical
  });

  System.updateSystem(update, function(err, system) {
    if (err || system == null) {
      res.json({
        success: false,
        msg: 'Could not save changes. Error: ' + err
      });
    } else {
      res.json({
        success: true,
        msg: system.name + ' was saved'
      });
    }
  });
}

function deleteSystem(req, res) {
  var id = req.headers.id;

  System.removeSystemById(id, function(err, system) {
    if (err || system == null) {
      res.json({
        success: false,
        msg: 'Could not delete system. Error: ' + err
      });
    } else {
      res.json({
        success: true,
        msg: system.name + ' was deleted'
      });
    }
  });
}

// Input Sectors ---------------------------------------------------------------
router.route('/system/input')
  .get(function(req, res, next) {
    getInputSector(req,res);
  })
  .post(function(req, res, next) {
    addInputSector(req, res);
  })
  .put(function(req, res, next) {
    updateInputSector(req, res);
  })
  .delete(function(req, res, next) {
    deleteInputSector(req, res);
  });

function getInputSector(req, res) {
  var id = req.headers.id;

  if (id != null && id != undefined && id != "") {
    ISector.getISectorById(id, function(err, sector) {
      if (err || sector == null) {
        res.json({
          success: false,
          msg: ('Could not retrieve the input sector. Error: ' + err),
          sector: undefined
        });
      } else {
        res.json({
          success: true,
          msg: 'Retrieved the requested input sector',
          sector: sector
        });
      }
    });
  } else {
    res.json({
      success: false,
      msg: ('This request requires a valid ID'),
      systems: undefined
    });
  }
}

function addInputSector(req, res) {
  var newSector = new ISector({
    name: req.body.name,
    system: req.body.system,
    type: req.body.type,
    key: req.body.key,
    iEvents: req.body.iEvents
  });

  ISector.addISector(newSector, function(err, sector) {
    if (err || sector == null) {
      res.json({
        success: false,
        msg: 'Could not save the sector. Error: ' + err
      });
    } else {
      res.json({
        success: true,
        msg: sector.name + ' was saved.'
      });
    }
  });
}

function updateInputSector(req, res) {
  var update = new ISector({
    _id: req.body._id,
    name: req.body.name,
    type: req.body.type,
    key: req.body.key,
    iEvents: req.body.iEvents
  });

  ISector.updateISector(update, function(err, sector) {
    if (err || sector == null) {
      res.json({
        success: false,
        msg: 'Could not save changes. Error: ' + err
      });
    } else {
      res.json({
        success: true,
        msg: sector.name + ' was saved'
      });
    }
  });
}

function deleteInputSector(req, res) {
  var id = req.headers.id;

  ISector.detachISectorById(id, function(err, sector) {
    if (err || sector == null) {
      res.json({
        success: false,
        msg: 'Could not detach the input sector. Error: ' + err
      });
    } else {
      ISector.removeISectorById(id, function(err, sector) {
        if (err || sector == null) {
          res.json({
            success: false,
            msg: 'Could not delete input sector. Error: ' + err
          });
        } else {
          res.json({
            success: true,
            msg: sector.name + ' was deleted'
          });
        }
      });
    }
  });
}

// Output Sectors --------------------------------------------------------------
router.route('/system/output')
  .get(function(req, res, next) {
    getOutputSector(req,res);
  })
  .post(function(req, res, next) {
    addOutputSector(req, res);
  })
  .put(function(req, res, next) {
    updateOutputSector(req, res);
  })
  .delete(function(req, res, next) {
    deleteOutputSector(req, res);
  });

function getOutputSector(req, res) {
  var id = req.headers.id;

  if (id != null && id != undefined && id != "") {
    OSector.getOSectorById(id, function(err, sector) {
      if (err || sector == null) {
        res.json({
          success: false,
          msg: ('Could not retrieve the output sector. Error: ' + err),
          sector: undefined
        });
      } else {
        res.json({
          success: true,
          msg: 'Retrieved the requested output sector',
          sector: sector
        });
      }
    });
  } else {
    res.json({
      success: false,
      msg: ('This request requires a valid ID'),
      systems: undefined
    });
  }
}

function addOutputSector(req, res) {
  var newSector = new OSector({
    name: req.body.name,
    system: req.body.system,
    type: req.body.type,
    key: req.body.key,
    oEvents: req.body.oEvents
  });

  OSector.addOSector(newSector, function(err, sector) {
    if (err || sector == null) {
      res.json({
        success: false,
        msg: 'Could not save the sector. Error: ' + err
      });
    } else {
      res.json({
        success: true,
        msg: sector.name + ' was saved.'
      });
    }
  });
}

function updateOutputSector(req, res) {
  var update = new OSector({
    _id: req.body._id,
    name: req.body.name,
    type: req.body.type,
    key: req.body.key,
    oEvents: req.body.oEvents
  });

  OSector.updateOSector(update, function(err, sector) {
    if (err || sector == null) {
      res.json({
        success: false,
        msg: 'Could not save changes. Error: ' + err
      });
    } else {
      res.json({
        success: true,
        msg: sector.name + ' was saved'
      });
    }
  });
}

function deleteOutputSector(req, res) {
  var id = req.headers.id;

  OSector.detachOSectorById(id, function(err, sector) {
    if (err || sector == null) {
      res.json({
        success: false,
        msg: 'Could not detach the output sector. Error: ' + err
      });
    } else {
      OSector.removeOSectorById(id, function(err, sector) {
        if (err || sector == null) {
          res.json({
            success: false,
            msg: 'Could not delete output sector. Error: ' + err
          });
        } else {
          res.json({
            success: true,
            msg: sector.name + ' was deleted'
          });
        }
      });
    }
  });
}

module.exports = router;
