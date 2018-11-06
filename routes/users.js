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
const IEvent    = require('../models/ievent');
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

  if (id != null && id != undefined && id != "") {
    System.getSystemById(id, function(err, system) {
      if (err) {
        res.json({
          success: false,
          msg: ('Could not retrieve the system. Error: ' + err),
          system: undefined
        });
      } else if (system == null) {
        res.json({
          success: false,
          msg: ('Could not retrieve the system. Error: ID not found'),
          system: undefined
        });
      } else {
        res.json({
          success: true,
          msg: 'Retrieved the system',
          system: system
        });
      }
    });
  } else {
    System.getAllSystems(function(err, systems) {
      if (err) {
        res.json({
          success: false,
          msg: ('Could not retrieve the systems. Error: ' + err),
          systems: undefined
        });
      } else if (systems == null) {
        res.json({
          success: false,
          msg: ('Could not retrieve the systems. Error: none found'),
          systems: undefined
        });
      } else {
        res.json({
          success: true,
          msg: 'Retrieved all systems',
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
    if (err) {
      res.json({
        success: false,
        msg: 'Could not add the system. Error: ' + err
      });
    } else if (system == null) {
      res.json({
        success: false,
        msg: 'Could not add the system. Error: internal error'
      });
    } else {
      res.json({
        success: true,
        msg: system.name + ' was saved'
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
    if (err) {
      res.json({
        success: false,
        msg: 'Could not update the system. Error: ' + err
      });
    } else if (system == null) {
      res.json({
        success: false,
        msg: 'Could not update the system. Error: ID not found'
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
    if (err) {
      res.json({
        success: false,
        msg: 'Could not delete system. Error: ' + err
      });
    } else if (system == null) {
      res.json({
        success: false,
        msg: 'Could not delete system. Error: ID not found'
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
      if (err) {
        res.json({
          success: false,
          msg: ('Could not retrieve the sector. Error: ' + err),
          sector: undefined
        });
      } else if (sector == null) {
        res.json({
          success: false,
          msg: ('Could not retrieve the sector. Error: ID not found'),
          sector: undefined
        });
      } else {
        res.json({
          success: true,
          msg: 'Retrieved the requested sector',
          sector: sector
        });
      }
    });
  } else {
    res.json({
      success: false,
      msg: ('This request requires a valid ID'),
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

  ISector.addISector(newSector, function(err, sector) {
    if (err) {
      res.json({
        success: false,
        msg: 'Could not add the sector. Error: ' + err
      });
    } else if (sector == null) {
      res.json({
        success: false,
        msg: 'Could not add the sector. Error: internal error'
      });
    } else {
      res.json({
        success: true,
        msg: sector.name + ' was saved'
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
    if (err) {
      res.json({
        success: false,
        msg: 'Could not update the sector. Error: ' + err
      });
    } else if (sector == null) {
      res.json({
        success: false,
        msg: 'Could not update the sector. Error: ID not found'
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
    if (err) {
      res.json({
        success: false,
        msg: 'Could not detach the sector. Error: ' + err
      });
    } else if (sector == null) {
      res.json({
        success: false,
        msg: 'Could not detach the sector. Error: ID not found'
      });
    } else {
      ISector.removeISectorById(id, function(err, sector) {
        if (err) {
          res.json({
            success: false,
            msg: 'Could not delete the sector. Error: ' + err
          });
        } else if (sector == null) {
          res.json({
            success: false,
            msg: 'Could not delete the sector. Error: internal error'
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
      if (err) {
        res.json({
          success: false,
          msg: ('Could not retrieve the sector. Error: ' + err),
          sector: undefined
        });
      } else if (sector == null) {
        res.json({
          success: false,
          msg: ('Could not retrieve the sector. Error: ID not found'),
          sector: undefined
        });
      } else {
        res.json({
          success: true,
          msg: 'Retrieved the requested sector',
          sector: sector
        });
      }
    });
  } else {
    res.json({
      success: false,
      msg: ('This request requires a valid ID'),
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

  OSector.addOSector(newSector, function(err, sector) {
    if (err) {
      res.json({
        success: false,
        msg: 'Could not add the sector. Error: ' + err
      });
    } else if (sector == null) {
      res.json({
        success: false,
        msg: 'Could not add the sector. Error: ID not found'
      });
    } else {
      res.json({
        success: true,
        msg: sector.name + ' was saved'
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
    if (err) {
      res.json({
        success: false,
        msg: 'Could not update the sector. Error: ' + err
      });
    } else if (sector == null) {
      res.json({
        success: false,
        msg: 'Could not update the sector. Error: ID not found'
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
    if (err) {
      res.json({
        success: false,
        msg: 'Could not detach the sector. Error: ' + err
      });
    } else if (sector == null) {
      res.json({
        success: false,
        msg: 'Could not detach the sector. Error: ID not found'
      });
    } else {
      OSector.removeOSectorById(id, function(err, sector) {
        if (err) {
          res.json({
            success: false,
            msg: 'Could not delete the sector. Error: ' + err
          });
        } else if (sector == null) {
          res.json({
            success: false,
            msg: 'Could not delete the sector. Error: internal error'
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

  if (id != null && id != undefined && id != "") {
    OEvent.getOEventById(id, function(err, oEvent) {
      if (err) {
        res.json({
          success: false,
          msg: ('Could not retrieve the event. Error: ' + err),
          oEvent: undefined
        });
      } else if (oEvent == null) {
        res.json({
          success: false,
          msg: ('Could not retrieve the event. Error: ID not found'),
          oEvent: undefined
        });
      } else {
        res.json({
          success: true,
          msg: 'Retrieved the requested event',
          oEvent: oEvent
        });
      }
    });
  } else {
    res.json({
      success: false,
      msg: ('This request requires a valid ID'),
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

  OEvent.addOEvent(newEvent, function(err, oEvent) {
    if (err) {
      res.json({
        success: false,
        msg: 'Could not add the event. Error: ' + err
      });
    } else if (oEvent == null) {
      res.json({
        success: false,
        msg: 'Could not add the event. Error: ID not found'
      });
    } else {
      res.json({
        success: true,
        msg: oEvent.tag + ' was saved'
      });
    }
  });
}

function updateOutputEvent(req, res) {
  var update = new OEvent({
    _id: req.body._id,
    tag: req.body.tag,
    start: req.body.start,
    duration: req.body.duration,
    interval: req.body.interval
  });

  OEvent.updateOEvent(update, function(err, oEvent) {
    if (err) {
      res.json({
        success: false,
        msg: 'Could not update the event. Error: ' + err
      });
    } else if (oEvent == null) {
      res.json({
        success: false,
        msg: 'Could not update the event. Error: ID not found'
      });
    } else {
      res.json({
        success: true,
        msg: oEvent.tag + ' was saved'
      });
    }
  });
}

function deleteOutputEvent(req, res) {
  var id = req.headers.id;

  OEvent.detachOEventById(id, function(err, oEvent) {
    if (err) {
      res.json({
        success: false,
        msg: 'Could not detach the event. Error: ' + err
      });
    } else if (oEvent == null) {
      res.json({
        success: false,
        msg: 'Could not detach the event. Error: ID not found'
      });
    } else {
      OEvent.removeOEventById(id, function(err, oEvent) {
        if (err) {
          res.json({
            success: false,
            msg: 'Could not delete the event. Error: ' + err
          });
        } else if (oEvent == null) {
          res.json({
            success: false,
            msg: 'Could not delete the event. Error: internal error'
          });
        } else {
          res.json({
            success: true,
            msg: oEvent.tag + ' was deleted'
          });
        }
      });
    }
  });
}

// Input Events ----------------------------------------------------------------
router.route('/system/input/event')
  .get(function(req, res, next) {
    getInputEvent(req,res);
  })
  .post(function(req, res, next) {
    addInputEvent(req, res);
  })
  .put(function(req, res, next) {
    updateInputEvent(req, res);
  })
  .delete(function(req, res, next) {
    deleteInputEvent(req, res);
  });

function getInputEvent(req, res) {
  var id = req.headers.id;

  if (id != null && id != undefined && id != "") {
    IEvent.getIEventById(id, function(err, iEvent) {
      if (err) {
        res.json({
          success: false,
          msg: ('Could not retrieve the event. Error: ' + err),
          iEvent: undefined
        });
      } else if (iEvent == null) {
        res.json({
          success: false,
          msg: ('Could not retrieve the event. Error: ID not found'),
          iEvent: undefined
        });
      } else {
        res.json({
          success: true,
          msg: 'Retrieved the requested event',
          iEvent: iEvent
        });
      }
    });
  } else {
    res.json({
      success: false,
      msg: ('This request requires a valid ID'),
      iEvent: undefined
    });
  }
}

function addInputEvent(req, res) {
  var newEvent = new IEvent({
    sector: req.body.sector,
    target: req.body.target,
    tag: req.body.tag,
    threshold: req.body.threshold,
    duration: req.body.duration
  });

  IEvent.addIEvent(newEvent, function(err, iEvent) {
    if (err) {
      res.json({
        success: false,
        msg: 'Could not add the event. Error: ' + err
      });
    } else if (iEvent == null) {
      res.json({
        success: false,
        msg: 'Could not add the event. Error: ID not found'
      });
    } else {
      res.json({
        success: true,
        msg: iEvent.tag + ' was saved'
      });
    }
  });
}

function updateInputEvent(req, res) {
  var update = new IEvent({
    _id: req.body._id,
    tag: req.body.tag,
    threshold: req.body.threshold,
    duration: req.body.duration
  });

  IEvent.updateIEvent(update, function(err, iEvent) {
    if (err) {
      res.json({
        success: false,
        msg: 'Could not update the event. Error: ' + err
      });
    } else if (iEvent == null) {
      res.json({
        success: false,
        msg: 'Could not update the event. Error: ID not found'
      });
    } else {
      res.json({
        success: true,
        msg: iEvent.tag + ' was saved'
      });
    }
  });
}

function deleteInputEvent(req, res) {
  var id = req.headers.id;

  IEvent.detachIEventById(id, function(err, iEvent) {
    if (err) {
      res.json({
        success: false,
        msg: 'Could not detach the event. Error: ' + err
      });
    } else if (iEvent == null) {
      res.json({
        success: false,
        msg: 'Could not detach the event. Error: ID not found'
      });
    } else {
      IEvent.removeIEventById(id, function(err, iEvent) {
        if (err) {
          res.json({
            success: false,
            msg: 'Could not delete the event. Error: ' + err
          });
        } else if (iEvent == null) {
          res.json({
            success: false,
            msg: 'Could not delete the event. Error: internal error'
          });
        } else {
          res.json({
            success: true,
            msg: iEvent.tag + ' was deleted'
          });
        }
      });
    }
  });
}

module.exports = router;
