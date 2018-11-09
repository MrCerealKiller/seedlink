/**
 * @file Current database configuration
 * @author Jeremy Mallette
 * @version 0.0.0
 * @module Config/Database
 */

// Database Configs ------------------------------------------------------------
module.exports = {
    url: 'mongodb://localhost:27017/',
    database: 'seedlink',
    test_database: 'test_seedlink',
    opts: {useMongoClient: true},
    key: 'rosemary-thyme-basil-oregano-coriander-2019'
}
