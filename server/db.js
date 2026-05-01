const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'avsts.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  // Employees Table
  db.run(`CREATE TABLE IF NOT EXISTS employees (
    id TEXT PRIMARY KEY,
    name TEXT,
    mobile TEXT,
    email TEXT,
    image TEXT,
    password TEXT
  )`);

  // Default Employee if not exists
  db.run(`INSERT OR IGNORE INTO employees (id, name, mobile, email, image, password) VALUES 
    ('EMP001', 'Ravi Kumar', '+91 9876543210', 'ravi@avsts.com', '', 'emp123'),
    ('EMP002', 'Kiran Sharma', '+91 8765432109', 'kiran@avsts.com', '', 'emp123')
  `);

  // Bookings Table
  db.run(`CREATE TABLE IF NOT EXISTS bookings (
    id TEXT PRIMARY KEY,
    service TEXT,
    name TEXT,
    phone TEXT,
    location TEXT,
    mapLink TEXT,
    problem TEXT,
    date TEXT,
    time TEXT,
    status TEXT
  )`);

  // Booking Assignments Table
  db.run(`CREATE TABLE IF NOT EXISTS booking_assignments (
    booking_id TEXT,
    employee_id TEXT,
    PRIMARY KEY(booking_id, employee_id),
    FOREIGN KEY(booking_id) REFERENCES bookings(id),
    FOREIGN KEY(employee_id) REFERENCES employees(id)
  )`);

  // Posts Table
  db.run(`CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    content TEXT,
    image TEXT,
    date TEXT
  )`);

  // Slideshows Table
  db.run(`CREATE TABLE IF NOT EXISTS slideshows (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    image TEXT
  )`);
});

module.exports = db;
