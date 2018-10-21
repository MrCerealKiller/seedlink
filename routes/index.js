/**
 * @file Unsecured backend routes
 * @author Jeremy Mallette
 * @version 0.0.0
 * @module Routes/Index
 * @see {@link module:Routes/Users} for protected routes
 */

const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
});

module.exports = router;
