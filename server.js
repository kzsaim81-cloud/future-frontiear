require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const path     = require('path');
const mongoose = require('mongoose');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── MongoDB Connect ──────────────────────────────────────
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected!'))
  .catch(err => console.error('❌ MongoDB error:', err));

// ── Schemas ──────────────────────────────────────────────
const enrollmentSchema = new mongoose.Schema({
  name:    String,
  phone:   String,
  course:  String,
  created_at: { type: Date, default: Date.now }
});

const contactSchema = new mongoose.Schema({
  name:    String,
  phone:   String,
  message: String,
  created_at: { type: Date, default: Date.now }
});

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);
const Contact    = mongoose.model('Contact', contactSchema);

// ── Middleware ───────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ── ENROLL ───────────────────────────────────────────────
app.post('/api/enroll', async (req, res) => {
  const { name, phone, course } = req.body;
  if (!name || !phone) {
    return res.status(400).json({ ok: false, message: 'Name aur phone number zaroor bharo.' });
  }
  try {
    const enrollment = await Enrollment.create({
      name:   name.trim(),
      phone:  phone.trim(),
      course: (course || 'General').trim()
    });
    res.json({ ok: true, message: `Shukriya ${name}! Hum aap se rabta karenge.`, id: enrollment._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, message: 'Server error. Dobara koshish karein.' });
  }
});

// ── ADMIN - List Enrollments ─────────────────────────────
app.get('/api/admin/enrollments', async (req, res) => {
  const secret = process.env.ADMIN_SECRET || 'saimownerofTFF303';
  if (req.query.secret !== secret) {
    return res.status(401).json({ ok: false, message: 'Unauthorized' });
  }
  const rows = await Enrollment.find().sort({ created_at: -1 });
  res.json({ ok: true, total: rows.length, enrollments: rows });
});

// ── ADMIN - Delete Enrollment ────────────────────────────
app.delete('/api/admin/enrollments/:id', async (req, res) => {
  const secret = process.env.ADMIN_SECRET || 'saimownerofTFF303';
  if (req.query.secret !== secret) {
    return res.status(401).json({ ok: false, message: 'Unauthorized' });
  }
  await Enrollment.findByIdAndDelete(req.params.id);
  res.json({ ok: true, message: 'Deleted' });
});

// ── CONTACT FORM ─────────────────────────────────────────
app.post('/api/contact', async (req, res) => {
  const { name, phone, message } = req.body;
  if (!name || !phone) {
    return res.status(400).json({ ok: false, message: 'Name aur phone zaroor bharo.' });
  }
  await Contact.create({
    name:    name.trim(),
    phone:   phone.trim(),
    message: (message || '').trim()
  });
  res.json({ ok: true, message: 'Aapka message mil gaya. Hum jald rabta karenge!' });
});

// ── CATCH ALL ────────────────────────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n🚀 Future Frontier server chal raha hai: http://localhost:${PORT}`);
  console.log(`📋 Admin panel: http://localhost:${PORT}/admin.html`);
});