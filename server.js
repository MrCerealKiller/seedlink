/**
 * @file Seedlink Server
 * @author Jeremy Mallette
 * @version 0.0.0
 * @module App/Server
 */

// ######################################
// ## CONSTANTS, IMPORTS, DEPENDENCIES ##
// ######################################

// Constants -------------------------------------------------------------------
const _PORT   = 3000;
const _SYS_ID = '5be16a873dde9a64dbedac38';

// Imports ---------------------------------------------------------------------
const express       = require('express');
const bluebird      = require('bluebird');
const bodyParser    = require('body-parser');
const cookieParser  = require('cookie-parser');
const cors          = require('cors');
const logger        = require('morgan');
const mongoose      = require('mongoose');
const path          = require('path');

// Local Modules ---------------------------------------------------------------
const indexRouter   = require('./routes/index');
const usersRouter   = require('./routes/users');
const db            = require('./config/database');
const tEventHandler = require('./services/timedeventhandler');

// Paths -----------------------------------------------------------------------
var staticPath = path.join(__dirname, 'public');

// Initialize App --------------------------------------------------------------
var app = express();

// ##############
// ## DATABASE ##
// ##############

// Initialize Mongoose ---------------------------------------------------------
mongoose.connect((process.env.MONGO_URL || db.url) + db.database, db.opts);
mongoose.Promise = bluebird;

mongoose.connection.on('connected', function() {
    console.log('Sucessfully connected to database\n');

    console.log('Initializing Timed Event Jobs...');
    tEventHandler.initDbJobs((process.env.SYS_ID || _SYS_ID));
});

mongoose.connection.on('error', function(err) {
    console.log('Error connecting to database\nError: ' + err + '\n');
});

// ################
// ## MIDDLEWARE ##
// ################

// Security --------------------------------------------------------------------
app.disable('x-powered-by');
app.use(cors());

// Configs ---------------------------------------------------------------------
app.use(logger('dev'));
app.use(express.static(staticPath));

// Parsers ---------------------------------------------------------------------
app.use(bodyParser.json());
app.use(cookieParser());

// #####################
// ## PORT AND ROUTES ##
// #####################

// Set Port --------------------------------------------------------------------
app.set('port', (process.env.PORT || _PORT));

// Routes ----------------------------------------------------------------------
app.use('/', indexRouter);
app.use('/users', usersRouter);

// Fallback to index.html ------------------------------------------------------
app.use(function(req, res) {
    res.sendFile(staticPath + '/index.html');
});

// Listen to Port --------------------------------------------------------------
app.listen(app.get('port'), function() {
    console.log('Server started on port: ' + app.get('port'));
});

module.exports = app;
