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
const Event     = require('../models/event');

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
    inputPorts: req.body.inputPorts,
    outputPorts: req.body.outputPorts,
    tempWarning: req.body.tempWarning,
    tempCritical: req.body.tempCritical,
    humidityWarning: req.body.humidityWarning,
    humidityCritical: req.body.humidityCritical,
    pHWarning: req.body.pHWarning,
    pHCritical: req.body.pHCritical,
    waterLevelWarning: req.body.waterLevelWarning,
    waterLevelCritical: req.body.waterLevelCritical,
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
    inputPorts: req.body.inputPorts,
    outputPorts: req.body.outputPorts,
    tempWarning: req.body.tempWarning,
    tempCritical: req.body.tempCritical,
    humidityWarning: req.body.humidityWarning,
    humidityCritical: req.body.humidityCritical,
    pHWarning: req.body.pHWarning,
    pHCritical: req.body.pHCritical,
    waterLevelWarning: req.body.waterLevelWarning,
    waterLevelCritical: req.body.waterLevelCritical,
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

module.exports = router;
