/** Database connection for messagely. */
const { DB_URI } = require('./config');

const { Client } = require('pg');

const client = new Client({ connectionString: DB_URI });

client.connect();

module.exports = client;
