/**
 * @file Current database configuration
 * @author Jeremy Mallette
 * @version 0.0.0
 * @module Config/Database
 */

// Database Configs ------------------------------------------------------------
module.exports = {
    database: 'mongodb://localhost:27017/seedlink',
    opts: {useMongoClient: true},
    key: 'rosemary-thyme-basil-oregano-coriander-2019'
}
