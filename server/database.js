import fs from 'fs';
import path from 'path';

const DATA_DIR = path.resolve('server/data');
const DB_FILE = path.join(DATA_DIR, 'nexus_db.json');

// Ensure database directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial empty DB structure (no default preloaded sample noise)
const DEFAULT_DB = {
  users: [
    {
      id: 'usr-admin-1',
      name: 'Root Administrator',
      email: 'admin@nexus.ai',
      password: 'admin2026!secret',
      role: 'System Administrator',
      avatar: '🛡️',
      status: 'ACTIVE',
      createdAt: new Date().toISOString()
    }
  ],
  profiles: {
    'usr-admin-1': {
      id: 'usr-admin-1',
      name: 'Root Administrator',
      email: 'admin@nexus.ai',
      avatar: '🛡️',
      targetRole: 'System Administrator',
      focusScore: 98,
      streakDays: 14,
      weeklyGoalHours: 25,
      learningVelocity: 1.45,
      weakTopics: ['Distributed Systems', 'Dynamic Programming'],
      strongTopics: ['Java 21', 'Spring Boot', 'SQL Optimization']
    }
  },
  missions: [],
  documents: [],
  nodes: [],
  quizzes: [],
  codeProjects: [],
  systemLogs: []
};

// Helper to load DB from disk
function loadDB() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading database file:', err);
  }

  // Save initial structure if file doesn't exist
  saveDB(DEFAULT_DB);
  return DEFAULT_DB;
}

// Helper to write DB to disk
function saveDB(db) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error saving database file:', err);
    return false;
  }
}

export const dbBackend = {
  // USER AUTHENTICATION
  findUserByEmail: (email) => {
    const db = loadDB();
    return db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  },

  createUser: (name, email, password, avatar = '👩‍🎓', targetRole = 'Computer Science Student') => {
    const db = loadDB();
    const existing = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) return { success: false, message: 'User with this email already exists.' };

    const newUser = {
      id: `usr-${Date.now()}`,
      name,
      email,
      password,
      role: targetRole,
      avatar,
      status: 'ACTIVE',
      createdAt: new Date().toISOString()
    };

    const newProfile = {
      id: newUser.id,
      name,
      email,
      avatar,
      targetRole,
      focusScore: 90,
      streakDays: 1,
      weeklyGoalHours: 20,
      learningVelocity: 1.0,
      weakTopics: [],
      strongTopics: []
    };

    db.users.push(newUser);
    db.profiles[newUser.id] = newProfile;
    saveDB(db);

    return { success: true, user: newUser, profile: newProfile };
  },

  updateLastLogin: (email) => {
    const db = loadDB();
    const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      user.lastLogin = new Date().toISOString();
      saveDB(db);
      return true;
    }
    return false;
  },

  getAllUsers: () => {
    const db = loadDB();
    return db.users.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      avatar: u.avatar,
      status: u.status,
      createdAt: u.createdAt,
      lastLogin: u.lastLogin || 'Never'
    }));
  },

  updateUserStatus: (id, status) => {
    const db = loadDB();
    const user = db.users.find(u => u.id === id);
    if (user) {
      user.status = status;
      saveDB(db);
      return true;
    }
    return false;
  },

  // MISSIONS MANAGEMENT
  getMissions: (userId) => {
    const db = loadDB();
    if (!userId) return db.missions;
    return db.missions.filter(m => m.userId === userId || !m.userId);
  },

  addMission: (mission) => {
    const db = loadDB();
    const newMission = {
      id: mission.id || `msn-${Date.now()}`,
      userId: mission.userId || 'usr-admin-1',
      title: mission.title,
      category: mission.category || 'assignment',
      priority: mission.priority || 'medium',
      completed: !!mission.completed,
      duration: mission.duration || '45 mins',
      difficulty: mission.difficulty || 'Medium',
      createdAt: new Date().toISOString()
    };
    db.missions.unshift(newMission);
    saveDB(db);
    return newMission;
  },

  updateMission: (id, updates) => {
    const db = loadDB();
    const idx = db.missions.findIndex(m => m.id === id);
    if (idx !== -1) {
      db.missions[idx] = { ...db.missions[idx], ...updates };
      saveDB(db);
      return db.missions[idx];
    }
    return null;
  },

  deleteMission: (id) => {
    const db = loadDB();
    const initialLen = db.missions.length;
    db.missions = db.missions.filter(m => m.id !== id);
    saveDB(db);
    return db.missions.length < initialLen;
  },

  // DOCUMENTS & RAG MEMORY
  getDocuments: (userId) => {
    const db = loadDB();
    if (!userId) return db.documents;
    return db.documents.filter(d => d.userId === userId || !d.userId);
  },

  addDocument: (doc) => {
    const db = loadDB();
    const newDoc = {
      id: doc.id || `doc-${Date.now()}`,
      userId: doc.userId || 'usr-admin-1',
      title: doc.title,
      type: doc.type || 'pdf',
      size: doc.size || '1.2 MB',
      uploadDate: new Date().toLocaleDateString(),
      summary: doc.summary || `Parsed and indexed file "${doc.title}". Ready for AI RAG retrieval.`,
      keyConcepts: doc.keyConcepts || ['Note Retrieval', 'Vector Embeddings'],
      parsedContent: doc.parsedContent || ''
    };
    db.documents.unshift(newDoc);
    saveDB(db);
    return newDoc;
  },

  deleteDocument: (id) => {
    const db = loadDB();
    const initialLen = db.documents.length;
    db.documents = db.documents.filter(d => d.id !== id);
    saveDB(db);
    return db.documents.length < initialLen;
  },

  // STATS & SYSTEM METRICS
  getStats: () => {
    const db = loadDB();
    return {
      userCount: db.users.length,
      profileCount: Object.keys(db.profiles).length,
      missionCount: db.missions.length,
      documentCount: db.documents.length,
      nodeCount: db.nodes.length,
      storageEngine: 'Node.js Express File DB (server/data/nexus_db.json)'
    };
  },

  resetDB: () => {
    saveDB(DEFAULT_DB);
    return DEFAULT_DB;
  }
};
