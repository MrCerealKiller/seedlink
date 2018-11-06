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
const iEvent    = require('../models/ievent');
const OSector   = require('../models/osector');
const OEvent    = require('../models/oevent');

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

  try {
    if (id != null && id != undefined && id != "") {
      System.getSystemById(id, function(err, system) {
        if (err) {
          throw err;
        } else if (system == null) {
          throw new Error('id not found');
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
        if (err) {
          throw err;
        } else if (systems == null) {
          throw new Error('unable to find systems (null)');
        } else {
          res.json({
            success: true,
            msg: 'Retrieved Seedlink systems',
            systems: systems
          });
        }
      });
    }
  } catch (err) {
    res.json({
      success: false,
      msg: ('Could not retrieve the system. Error: ' + err),
      system: undefined,
      systems: undefined
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

  try {
    System.addSystem(newSystem, function(err, system) {
      if (err) {
        throw err;
      } else if (system == null) {
        throw new Error('id not found');
      } else {
        res.json({
          success: true,
          msg: system.name + ' was saved.'
        });
      }
    });
  } catch (err) {
    res.json({
      success: false,
      msg: ('Could not add the system. Error: ' + err)
    });
  }
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

  try {
    System.updateSystem(update, function(err, system) {
      if (err) {
        throw err;
      } else if (system == null) {
        throw new Error('id not found');
      } else {
        res.json({
          success: true,
          msg: system.name + ' was saved'
        });
      }
    });
  } catch (err) {
    res.json({
      success: false,
      msg: ('Could not update the system. Error: ' + err)
    });
  }
}

function deleteSystem(req, res) {
  var id = req.headers.id;

  try {
    System.removeSystemById(id, function(err, system) {
      if (err || system) {
        throw err;
      } else if (system == null) {
        throw new Error('id not found');
      } else {
        res.json({
          success: true,
          msg: system.name + ' was deleted'
        });
      }
    });
  } catch (err) {
    res.json({
      success: false,
      msg: ('Could not delete the system. Error: ' + err)
    });
  }
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

  try {
    if (id != null && id != undefined && id != "") {
      ISector.getISectorById(id, function(err, sector) {
        if (err) {
          throw err;
        } else if (sector == null) {
          throw new Error('id not found');
        } else {
          res.json({
            success: true,
            msg: 'Retrieved the requested input sector',
            sector: sector
          });
        }
      });
    } else {
      throw new Error('this request requires a valid ID');
    }
  } catch (err) {
    res.json({
      success: false,
      msg: ('Could not retrieve the sector. Error: ' + err),
      sector: undefined
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

  try {
    ISector.addISector(newSector, function(err, sector) {
      if (err) {
        throw err;
      } else if (sector == null) {
        throw new Error('id not found');
      } else {
        res.json({
          success: true,
          msg: sector.name + ' was saved.'
        });
      }
    });
  } catch (err) {
    res.json({
      success: false,
      msg: ('Could not add the sector. Error: ' + err)
    });
  }
}

function updateInputSector(req, res) {
  var update = new ISector({
    _id: req.body._id,
    name: req.body.name,
    type: req.body.type,
    key: req.body.key,
    iEvents: req.body.iEvents
  });

  try {
    ISector.updateISector(update, function(err, sector) {
      if (err) {
        throw err;
      } else if (sector == null) {
        throw new Error('id not found');
      } else {
        res.json({
          success: true,
          msg: sector.name + ' was saved'
        });
      }
    });
  } catch (err) {
    res.json({
      success: false,
      msg: ('Could not update the sector. Error: ' + err)
    });
  }
}

function deleteInputSector(req, res) {
  var id = req.headers.id;

  try {
    ISector.detachISectorById(id, function(err, sector) {
      if (err) {
        throw err;
      } else if (sector == null) {
        throw new Error('coudl not detach. ID not found');
      } else {
        ISector.removeISectorById(id, function(err, sector) {
          if (err) {
            throw err;
          } else if (sector == null) {
            throw new Error('id not found');
          } else {
            res.json({
              success: true,
              msg: sector.name + ' was deleted'
            });
          }
        });
      }
    });
  } catch (err) {
    res.json({
      success: false,
      msg: ('Could not delete the sector. Error: ' + err)
    });
  }
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

  try {
    if (id != null && id != undefined && id != "") {
      OSector.getOSectorById(id, function(err, sector) {
        if (err) {
          throw err;
        } else if (sector == null) {
          throw new Error('id not found');
        } else {
          res.json({
            success: true,
            msg: 'Retrieved the requested output sector',
            sector: sector
          });
        }
      });
    } else {
      throw new Error('this request requires a valid id');
    }
  } catch (err) {
    res.json({
      success: false,
      msg: ('Could not retrieve the sector. Error: ' + err),
      sector: undefined
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

  try {
    OSector.addOSector(newSector, function(err, sector) {
      if (err) {
        throw err;
      } else if (sector == null) {
        throw new Error('id not found');
      } else {
        res.json({
          success: true,
          msg: sector.name + ' was saved.'
        });
      }
    });
  } catch (err) {
    res.json({
      success: false,
      msg: ('Could not add the sector. Error: ' + err)
    });
  }
}

function updateOutputSector(req, res) {
  var update = new OSector({
    _id: req.body._id,
    name: req.body.name,
    type: req.body.type,
    key: req.body.key,
    oEvents: req.body.oEvents
  });

  try {
    OSector.updateOSector(update, function(err, sector) {
      if (err) {
        throw err;
      } else if (sector == null) {
        throw new Error('id not found');
      } else {
        res.json({
          success: true,
          msg: sector.name + ' was saved'
        });
      }
    });
  } catch (err) {
    res.json({
      success: false,
      msg: ('Could not update the sector. Error: ' + err)
    });
  }
}

function deleteOutputSector(req, res) {
  var id = req.headers.id;

  try {
    OSector.detachOSectorById(id, function(err, sector) {
      if (err) {
        throw err;
      } else if (sector == null) {
        throw new Error('could not detach. id not found');
      } else {
        OSector.removeOSectorById(id, function(err, sector) {
          if (err) {
            throw err;
          } else if (sector == null) {
            throw new Error('id not found');
          } else {
            res.json({
              success: true,
              msg: sector.name + ' was deleted'
            });
          }
        });
      }
    });
  } catch (err) {
    res.json({
      success: false,
      msg: ('Could not delete the sector. Error: ' + err)
    });
  }
}

// Output Events ---------------------------------------------------------------
router.route('/system/output/event')
  .get(function(req, res, next) {
    getOutputEvent(req,res);
  })
  .post(function(req, res, next) {
    addOutputEvent(req, res);
  })
  .put(function(req, res, next) {
    updateOutputEvent(req, res);
  })
  .delete(function(req, res, next) {
    deleteOutputEvent(req, res);
  });

function getOutputEvent(req, res) {
  var id = req.headers.id;

  try {
    if (id != null && id != undefined && id != "") {
      OEvent.getOEventById(id, function(err, oEvent) {
        if (err) {
          throw err;
        } else if (oEvent == null) {
          throw new Error('id not found');
        } else {
          res.json({
            success: true,
            msg: 'Retrieved the requested output event',
            oEvent: oEvent
          });
        }
      });
    } else {
      throw new Error('this request requires a valid id');
    }
  } catch (err) {
    res.json({
      success: false,
      msg: ('Could not retrieve the event. Error: ' + err),
      oEvent: undefined
    });
  }
}

function addOutputEvent(req, res) {
  var newEvent = new OEvent({
    sector: req.body.sector,
    tag: req.body.tag,
    start: req.body.start,
    duration: req.body.duration,
    interval: req.body.interval
  });

  try {
    OEvent.addOEvent(newEvent, function(err, oEvent) {
      if (err) {
        throw err;
      } else if (oEvent == null) {
        throw new Error('id not found');
      } else {
        res.json({
          success: true,
          msg: oEvent.tag + ' was saved.'
        });
      }
    });
  } catch (err) {
    res.json({
      success: false,
      msg: ('Could not add the event. Error: ' + err)
    });
  }
}

function updateOutputEvent(req, res) {
  var update = new OEvent({
    tag: req.body.tag,
    start: req.body.start,
    duration: req.body.duration,
    interval: req.body.interval
  });

  try {
    OEvent.updateOEvent(update, function(err, oEvent) {
      if (err) {
        throw err;
      } else if (oEvent == null) {
        throw new Error('id not found');
      } else {
        res.json({
          success: true,
          msg: oEvent.tag + ' was saved'
        });
      }
    });
  } catch (err) {
    res.json({
      success: false,
      msg: ('Could not update the event. Error: ' + err)
    });
  }
}

function deleteOutputSector(req, res) {
  var id = req.headers.id;

  try {
    OEvent.detachOEventById(id, function(err, oEvent) {
      if (err) {
        throw err;
      } else if (oEvent == null) {
        throw new Error('could not detach. Id not found');
      } else {
        OEvent.removeOEventById(id, function(err, oEvent) {
          if (err) {
            throw err;
          } else if (oEvent == null) {
            throw new Error('id not found');
          } else {
            res.json({
              success: true,
              msg: oEvent.tag + ' was deleted'
            });
          }
        });
      }
    });
  } catch (err) {
    res.json({
      success: false,
      msg: ('Could not delete the event. Error: ' + err)
    });
  }
}

module.exports = router;
