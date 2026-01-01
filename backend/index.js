import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

const ADMIN_EMAIL = 'admin@gmail.com';
const ADMIN_PASSWORD = 'admin@123';

let dbReady = false;
let dbInfo = { host: null, name: null };

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, required: true, enum: ['admin', 'user'], default: 'user' },
    createdAt: { type: Date, required: true, default: Date.now },
  },
  {
    timestamps: false,
    strict: true,
  }
);

const User = mongoose.model('User', UserSchema);

const ensureAdminUser = async () => {
  if (!dbReady) return;
  const email = ADMIN_EMAIL.toLowerCase();
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await User.updateOne(
    { email },
    { $set: { email, passwordHash, role: 'admin' }, $setOnInsert: { createdAt: new Date() } },
    { upsert: true }
  );
};

const connectDb = async () => {
  if (!MONGODB_URI) {
    // eslint-disable-next-line no-console
    console.error('Missing MONGODB_URI. Create backend/.env based on backend/.env.example');
    dbReady = false;
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI);
    dbReady = true;
    dbInfo = {
      host: mongoose.connection.host,
      name: mongoose.connection.name,
    };
    // eslint-disable-next-line no-console
    console.log(`MongoDB connected: ${dbInfo.host}/${dbInfo.name}`);
  } catch (e) {
    dbReady = false;
    dbInfo = { host: null, name: null };
    // eslint-disable-next-line no-console
    console.error('MongoDB connection failed:', e);
  }
};

const ProjectSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
  },
  {
    timestamps: false,
    strict: false,
  }
);

const Project = mongoose.model('Project', ProjectSchema);

const app = express();

app.use(cors());
app.use(express.json({ limit: '25mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, dbReady, db: dbInfo });
});

app.post('/api/auth/register', async (req, res) => {
  if (!dbReady) {
    return res.status(503).json({ message: 'Database not connected' });
  }

  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  if (email === ADMIN_EMAIL.toLowerCase()) {
    return res.status(400).json({ message: 'This email is reserved' });
  }

  const exists = await User.findOne({ email }).lean();
  if (exists) {
    return res.status(409).json({ message: 'User already exists' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const created = await User.create({ email, passwordHash, role: 'user', createdAt: new Date() });
  res.status(201).json({ id: created._id.toString(), email: created.email, role: created.role });
});

app.post('/api/auth/login', async (req, res) => {
  if (!dbReady) {
    return res.status(503).json({ message: 'Database not connected' });
  }

  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  if (email === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD) {
    return res.json({ id: 'admin', email, role: 'admin' });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  res.json({ id: user._id.toString(), email: user.email, role: user.role });
});

app.get('/api/projects', async (_req, res) => {
  if (!dbReady) {
    return res.status(503).json({ message: 'Database not connected' });
  }
  const projects = await Project.find({}).lean();
  res.json(projects);
});

app.post('/api/projects', async (req, res) => {
  if (!dbReady) {
    return res.status(503).json({ message: 'Database not connected' });
  }
  const body = req.body || {};
  const id = body.id || Date.now().toString();
  const createdAt = body.createdAt || new Date().toISOString();
  const doc = await Project.create({ ...body, id, createdAt });
  res.status(201).json(doc);
});

app.put('/api/projects/:id', async (req, res) => {
  if (!dbReady) {
    return res.status(503).json({ message: 'Database not connected' });
  }
  const { id } = req.params;
  const updates = req.body || {};

  const updated = await Project.findOneAndUpdate({ id }, { $set: updates }, { new: true }).lean();
  if (!updated) {
    return res.status(404).json({ message: 'Project not found' });
  }
  res.json(updated);
});

app.delete('/api/projects/:id', async (req, res) => {
  if (!dbReady) {
    return res.status(503).json({ message: 'Database not connected' });
  }
  const { id } = req.params;
  const deleted = await Project.findOneAndDelete({ id }).lean();
  if (!deleted) {
    return res.status(404).json({ message: 'Project not found' });
  }
  res.json({ ok: true });
});

connectDb().finally(() => {
  ensureAdminUser().catch(() => {});
  app.listen(PORT, () => {
  // eslint-disable-next-line no-console
    console.log(`API listening on http://localhost:${PORT}`);
  });
});
