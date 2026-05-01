const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const db = require('./db.cjs');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, 'uploads')),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// ---- EMPLOYEES ----
app.get('/api/employees', (req, res) => {
  db.all('SELECT * FROM employees', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/employees', upload.single('image'), (req, res) => {
  const { id, name, mobile, email, password } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : '';
  db.run('INSERT INTO employees (id, name, mobile, email, image, password) VALUES (?, ?, ?, ?, ?, ?)', 
    [id, name, mobile, email, image, password], 
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id, name, mobile, email, image });
    }
  );
});

app.put('/api/employees/:id', (req, res) => {
  const { name, mobile, email } = req.body;
  db.run('UPDATE employees SET name = ?, mobile = ?, email = ? WHERE id = ?', 
    [name, mobile, email, req.params.id], 
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

app.delete('/api/employees/:id', (req, res) => {
  db.run('DELETE FROM employees WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

app.post('/api/employee/login', (req, res) => {
  const { id, password } = req.body;
  db.get('SELECT * FROM employees WHERE id = ? AND password = ?', [id, password], (err, row) => {
    if (row) res.json({ success: true, employee: row });
    else res.status(401).json({ error: 'Invalid credentials' });
  });
});

// ---- BOOKINGS ----
app.post('/api/bookings', (req, res) => {
  const { id, service, name, phone, location, mapLink, problem, date, time } = req.body;
  db.run(`INSERT INTO bookings (id, service, name, phone, location, mapLink, problem, date, time, status) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending')`, 
    [id, service, name, phone, location, mapLink, problem, date, time], 
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

app.get('/api/bookings', (req, res) => {
  db.all('SELECT * FROM bookings ORDER BY date DESC', [], (err, bookings) => {
    if (err) return res.status(500).json({ error: err.message });
    
    db.all(`SELECT ba.booking_id, e.id, e.name, e.mobile FROM booking_assignments ba JOIN employees e ON ba.employee_id = e.id`, [], (err, assigns) => {
      if (err) return res.status(500).json({ error: err.message });
      
      const result = bookings.map(b => {
        return {
          ...b,
          allotted: assigns.filter(a => a.booking_id === b.id)
        };
      });
      res.json(result);
    });
  });
});

app.get('/api/bookings/:id', (req, res) => {
  db.get('SELECT * FROM bookings WHERE id = ?', [req.params.id], (err, booking) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    
    db.all(`SELECT e.id, e.name, e.mobile FROM booking_assignments ba JOIN employees e ON ba.employee_id = e.id WHERE ba.booking_id = ?`, [req.params.id], (err, assigns) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ ...booking, allotted: assigns });
    });
  });
});

app.get('/api/employee/:id/tasks', (req, res) => {
  db.all(`SELECT b.* FROM bookings b JOIN booking_assignments ba ON b.id = ba.booking_id WHERE ba.employee_id = ?`, [req.params.id], (err, tasks) => {
    if (err) return res.status(500).json({ error: err.message });
    
    db.all(`SELECT ba.booking_id, e.id, e.name FROM booking_assignments ba JOIN employees e ON ba.employee_id = e.id`, [], (err, assigns) => {
      const result = tasks.map(t => {
        return {
          ...t,
          coWorkers: assigns.filter(a => a.booking_id === t.id && a.id !== req.params.id)
        };
      });
      res.json(result);
    });
  });
});

app.put('/api/bookings/:id/status', (req, res) => {
  const { status, cancelReason } = req.body;
  db.run('UPDATE bookings SET status = ?, cancelReason = ? WHERE id = ?', [status, cancelReason || null, req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

app.post('/api/bookings/:id/assign', (req, res) => {
  const { employeeIds } = req.body;
  db.serialize(() => {
    db.run('DELETE FROM booking_assignments WHERE booking_id = ?', [req.params.id]);
    const stmt = db.prepare('INSERT INTO booking_assignments (booking_id, employee_id) VALUES (?, ?)');
    employeeIds.forEach(empId => stmt.run([req.params.id, empId]));
    stmt.finalize();
    
    if (employeeIds.length > 0) {
      db.run('UPDATE bookings SET status = "In Progress" WHERE id = ?', [req.params.id]);
    } else {
      db.run('UPDATE bookings SET status = "Pending" WHERE id = ?', [req.params.id]);
    }
    res.json({ success: true });
  });
});

app.get('/api/available-employees', (req, res) => {
  db.all(`
    SELECT e.* FROM employees e
    WHERE e.id NOT IN (
      SELECT ba.employee_id FROM booking_assignments ba
      JOIN bookings b ON ba.booking_id = b.id
      WHERE b.status = 'In Progress' OR b.status = 'Accepted'
    )
  `, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// ---- POSTS ----
app.get('/api/posts', (req, res) => {
  db.all('SELECT * FROM posts ORDER BY id DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/posts', upload.single('image'), (req, res) => {
  const { title, content, date } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : '';
  db.run('INSERT INTO posts (title, content, image, date) VALUES (?, ?, ?, ?)', [title, content, image, date], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, id: this.lastID });
  });
});

app.delete('/api/posts/:id', (req, res) => {
  db.run('DELETE FROM posts WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// ---- SLIDESHOWS ----
app.get('/api/slideshows', (req, res) => {
  db.all('SELECT * FROM slideshows', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/slideshows', upload.single('image'), (req, res) => {
  const image = req.file ? `/uploads/${req.file.filename}` : '';
  const { title, animation } = req.body;
  if (!image) return res.status(400).json({ error: 'No image provided' });
  db.run('INSERT INTO slideshows (image, title, animation) VALUES (?, ?, ?)', [image, title, animation], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, id: this.lastID, image, title, animation });
  });
});

app.delete('/api/slideshows/:id', (req, res) => {
  db.run('DELETE FROM slideshows WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// ---- CAREERS ----
app.get('/api/careers', (req, res) => {
  db.all('SELECT * FROM careers ORDER BY id DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/careers', (req, res) => {
  const { title, content, type, location, date } = req.body;
  db.run('INSERT INTO careers (title, content, type, location, date) VALUES (?, ?, ?, ?, ?)',
    [title, content, type, location, date],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, id: this.lastID });
    }
  );
});

app.put('/api/careers/:id', (req, res) => {
  const { title, content, type, location, date, active } = req.body;
  db.run('UPDATE careers SET title=?, content=?, type=?, location=?, date=?, active=? WHERE id=?',
    [title, content, type, location, date, active, req.params.id],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

app.delete('/api/careers/:id', (req, res) => {
  db.run('DELETE FROM careers WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
