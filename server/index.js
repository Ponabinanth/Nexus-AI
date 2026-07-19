import express from 'express';
import cors from 'cors';
import { dbBackend } from './database.js';
import { processAiQuery } from './aiService.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`[NEXUS BACKEND ${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE 200 OK',
    system: 'NEXUS AI Operating System Backend',
    version: '1.0.0-production',
    timestamp: new Date().toISOString()
  });
});

// AUTHENTICATION API
app.post('/api/auth/signup', (req, res) => {
  const { name, email, password, avatar, targetRole } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
  }

  const result = dbBackend.createUser(name, email, password, avatar, targetRole);
  if (!result.success) {
    return res.status(400).json(result);
  }

  res.json(result);
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }

  const user = dbBackend.findUserByEmail(email);
  if (!user || user.password !== password) {
    return res.status(401).json({ success: false, message: 'Invalid credentials provided.' });
  }

  if (user.status === 'SUSPENDED') {
    return res.status(403).json({ success: false, message: 'This account has been suspended by Administrator.' });
  }

  // Update last login timestamp in db
  dbBackend.updateLastLogin(email);

  res.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar
    }
  });
});

// MISSIONS API
app.get('/api/missions', (req, res) => {
  const { userId } = req.query;
  const missions = dbBackend.getMissions(userId);
  res.json(missions);
});

app.post('/api/missions', (req, res) => {
  const mission = dbBackend.addMission(req.body);
  res.json({ success: true, mission });
});

app.put('/api/missions/:id', (req, res) => {
  const updated = dbBackend.updateMission(req.params.id, req.body);
  if (!updated) return res.status(404).json({ success: false, message: 'Mission not found.' });
  res.json({ success: true, mission: updated });
});

app.delete('/api/missions/:id', (req, res) => {
  const success = dbBackend.deleteMission(req.params.id);
  res.json({ success });
});

// DOCUMENTS API
app.get('/api/documents', (req, res) => {
  const { userId } = req.query;
  const docs = dbBackend.getDocuments(userId);
  res.json(docs);
});

app.post('/api/documents', (req, res) => {
  const doc = dbBackend.addDocument(req.body);
  res.json({ success: true, document: doc });
});

app.delete('/api/documents/:id', (req, res) => {
  const success = dbBackend.deleteDocument(req.params.id);
  res.json({ success });
});

// LIVE DYNAMIC AI QUERY API
app.post('/api/ai/query', async (req, res) => {
  try {
    const aiResponse = await processAiQuery(req.body);
    res.json(aiResponse);
  } catch (err) {
    console.error('AI Query Error:', err);
    res.status(500).json({ success: false, message: 'AI Engine internal error.' });
  }
});

// ADMIN API
app.get('/api/admin/users', (req, res) => {
  const users = dbBackend.getAllUsers();
  res.json(users);
});

app.post('/api/admin/users/status', (req, res) => {
  const { id, status } = req.body;
  const success = dbBackend.updateUserStatus(id, status);
  res.json({ success });
});

app.get('/api/admin/db/stats', (req, res) => {
  const stats = dbBackend.getStats();
  res.json(stats);
});

app.post('/api/admin/db/reset', (req, res) => {
  dbBackend.resetDB();
  res.json({ success: true, message: 'Database reset to default seed data.' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`🚀 NEXUS AI Backend Server Running on http://localhost:${PORT}`);
  console.log(`==================================================\n`);
});
