db.js

const Database = require('better-sqlite3');
const path     = require('path');

const db = new Database(path.join(__dirname, 'data', 'futurefrontier.db'));

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS enrollments (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT    NOT NULL,
    phone      TEXT    NOT NULL,
    course     TEXT    DEFAULT 'General',
    created_at TEXT    NOT NULL
  );

  CREATE TABLE IF NOT EXISTS contacts (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT    NOT NULL,
    phone      TEXT    NOT NULL,
    message    TEXT,
    created_at TEXT    NOT NULL
  );
`);

console.log('✅ Database ready: data/futurefrontier.db');
module.exports = db;