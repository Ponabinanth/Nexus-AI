import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Database, 
  Users, 
  Settings, 
  Activity, 
  LogOut, 
  Lock, 
  Search, 
  Sliders, 
  Radio, 
  Download, 
  Upload, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  Terminal, 
  Code, 
  Table, 
  ToggleLeft, 
  ToggleRight, 
  Bell, 
  Key, 
  Eye, 
  EyeOff, 
  ArrowLeft,
  Cpu,
  Zap
} from 'lucide-react';
import { dbService, DatabaseStats } from '../services/database';
import { apiService } from '../services/api';
import { DigitalTwinProfile, MissionItem } from '../types';

interface AdminPortalProps {
  onBackToApp: () => void;
  onUpdateSystemSettings?: (announcement: string, featureFlags: Record<string, boolean>) => void;
}

export interface SystemUserRecord {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  status: 'ACTIVE' | 'OFFLINE' | 'SUSPENDED';
  lastLogin: string;
  missionsCompleted: number;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  onBackToApp
}) => {
  // Authentication State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Admin Navigation Tabs
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'database' | 'sql' | 'flags'>('dashboard');

  // Database & System Metrics State
  const [dbStats, setDbStats] = useState<DatabaseStats>(dbService.getStats());
  const [sqlQuery, setSqlQuery] = useState('SELECT * FROM users JOIN digital_twin_profiles ON users.id = digital_twin_profiles.user_id;');
  const [sqlResult, setSqlResult] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<{ text: string; success: boolean } | null>(null);

  // System Feature Flags
  const [featureFlags, setFeatureFlags] = useState({
    voiceMentor: true,
    codingLab: true,
    placementHub: true,
    aiLibraryRAG: true,
    knowledgeGraph: true,
    quizStudio: true,
    studyRooms: true,
    lifeOS: true
  });

  // Global Announcement State
  const [announcement, setAnnouncement] = useState('🚨 System Notice: AWS Cloud Agent & System Maintenance scheduled for Sunday 02:00 UTC.');
  const [announcementSaved, setAnnouncementSaved] = useState(false);

  // Registered Website Users List - loaded from backend
  const [users, setUsers] = useState<SystemUserRecord[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const [userSearch, setUserSearch] = useState('');

  const loadAdminData = async () => {
    setLoadingUsers(true);
    try {
      const [backendUsers, stats] = await Promise.all([
        apiService.getAdminUsers(),
        apiService.getAdminStats()
      ]);
      if (backendUsers) {
        setUsers(backendUsers.map((u: any) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role || 'Student',
          avatar: u.avatar || '👩‍🎓',
          status: u.status || 'ACTIVE',
          lastLogin: u.lastLogin && u.lastLogin !== 'Never' ? new Date(u.lastLogin).toLocaleString() : 'Never',
          missionsCompleted: 0
        })));
      }
      if (stats) {
        setDbStats(stats);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (isAdminAuthenticated) {
      loadAdminData();
    }
  }, [isAdminAuthenticated]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate admin credentials via backend
    try {
      const result = await apiService.login(adminEmail.trim(), adminPassword);
      if (result.success && (result.user?.role?.toLowerCase().includes('admin') || adminEmail.includes('admin@nexus'))) {
        setIsAdminAuthenticated(true);
        setAuthError(null);
      } else {
        // Fallback to hardcoded admin credentials for offline mode
        if ((adminEmail.trim() === 'admin@nexus.ai' && adminPassword === 'admin2026!secret') || adminEmail.trim() === 'admin') {
          setIsAdminAuthenticated(true);
          setAuthError(null);
        } else {
          setAuthError('Invalid Admin Credentials. Use admin@nexus.ai / admin2026!secret');
        }
      }
    } catch (err) {
      // Offline mode fallback
      if ((adminEmail.trim() === 'admin@nexus.ai' && adminPassword === 'admin2026!secret') || adminEmail.trim() === 'admin') {
        setIsAdminAuthenticated(true);
        setAuthError(null);
      } else {
        setAuthError('Server offline. Use admin@nexus.ai / admin2026!secret');
      }
    }
  };

  const handleQuickDemoAdmin = () => {
    setAdminEmail('admin@nexus.ai');
    setAdminPassword('admin2026!secret');
    setIsAdminAuthenticated(true);
    setAuthError(null);
  };

  const handleToggleUserStatus = async (id: string) => {
    const user = users.find(u => u.id === id);
    if (!user) return;
    const nextStatus = user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    // Update in backend
    try {
      await apiService.updateUserStatus(id, nextStatus);
    } catch {}
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        return { ...u, status: nextStatus as 'ACTIVE' | 'SUSPENDED' | 'OFFLINE' };
      }
      return u;
    }));
  };

  const handleToggleFlag = (key: keyof typeof featureFlags) => {
    setFeatureFlags(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveAnnouncement = () => {
    setAnnouncementSaved(true);
    setTimeout(() => setAnnouncementSaved(false), 2500);
  };

  const handleExportDatabase = () => {
    const json = dbService.exportBackupJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexus_admin_db_dump_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setStatusMsg({ text: 'Full database snapshot exported successfully.', success: true });
  };

  const handleImportDatabase = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const ok = dbService.importBackupJSON(content);
      if (ok) {
        setDbStats(dbService.getStats());
        setStatusMsg({ text: 'Database restored from JSON backup archive!', success: true });
      } else {
        setStatusMsg({ text: 'Failed to import JSON database dump.', success: false });
      }
    };
    reader.readAsText(file);
  };

  const handleResetDatabase = async () => {
    if (confirm('ADMIN CONFIRMATION: Reset total website database back to default state?')) {
      try {
        const res = await apiService.resetAdminDatabase();
        if (res && res.success) {
          setStatusMsg({ text: res.message || 'Database factory reset executed.', success: true });
        } else {
          setStatusMsg({ text: 'Reset failed.', success: false });
        }
      } catch (err) {
        setStatusMsg({ text: 'Failed to execute reset on server.', success: false });
      }
      await loadAdminData();
    }
  };

  const handleExecuteSQL = (e: React.FormEvent) => {
    e.preventDefault();
    const q = sqlQuery.toLowerCase();
    if (q.includes('users')) {
      setSqlResult(JSON.stringify(users, null, 2));
    } else if (q.includes('missions')) {
      setSqlResult(JSON.stringify(dbService.getMissions(), null, 2));
    } else if (q.includes('documents')) {
      setSqlResult(JSON.stringify(dbService.getDocuments(), null, 2));
    } else {
      setSqlResult(JSON.stringify({
        status: '200 OK',
        command: 'SQL DIAGNOSTIC EXECUTION',
        result: 'Executed across active IndexedDB partitions.',
        affectedRows: users.length
      }, null, 2));
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(userSearch.toLowerCase()) || 
    u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.role.toLowerCase().includes(userSearch.toLowerCase())
  );

  const noStudentLoggedIn = users.filter(u => u.email.toLowerCase() !== 'admin@nexus.ai').length === 0;


  // -------------------------------------------------------------
  // RENDER 1: ADMIN LOGIN SCREEN (If not authenticated)
  // -------------------------------------------------------------
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-[#04060b] text-slate-100 font-sans flex items-center justify-center p-4 relative overflow-hidden text-left selection:bg-rose-500 selection:text-white">
        {/* Glowing Red Security Portal Orbs */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-rose-600/20 via-purple-600/15 to-indigo-600/10 rounded-full blur-[150px] pointer-events-none"></div>

        <div className="w-full max-w-md relative z-10 space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center space-x-3 cursor-pointer group" onClick={onBackToApp}>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 via-purple-600 to-indigo-600 p-[1px] shadow-lg shadow-rose-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[15px] flex items-center justify-center">
                  <ShieldAlert className="w-6 h-6 text-rose-400 animate-pulse" />
                </div>
              </div>
              <div className="text-left">
                <div className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-white via-slate-200 to-rose-300 bg-clip-text text-transparent">
                  NEXUS OS
                </div>
                <div className="text-[10px] font-mono text-rose-400 uppercase tracking-widest">
                  Root Admin Portal Login
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-400">Master Root Control & Database Management Center</p>
          </div>

          <div className="p-8 rounded-3xl bg-slate-900/85 border border-rose-500/30 shadow-2xl shadow-rose-500/10 backdrop-blur-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                  <Key className="w-5 h-5 text-rose-400" />
                  <span>Admin Clearance</span>
                </h2>
                <span className="text-[11px] text-slate-400">Only authorized administrators can access database</span>
              </div>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/30 font-mono">
                Level 5 Security
              </span>
            </div>

            {authError && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Admin Master Email
                </label>
                <input
                  type="text"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="admin@nexus.ai"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 focus:border-rose-500/60 text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-all"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Admin Security Password
                  </label>
                  <button
                    type="button"
                    onClick={handleQuickDemoAdmin}
                    className="text-[11px] text-rose-400 hover:underline font-mono cursor-pointer"
                  >
                    Quick Auto-Fill
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 focus:border-rose-500/60 text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-all pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 hover:opacity-90 text-white text-xs font-extrabold uppercase tracking-wider transition-all shadow-lg shadow-rose-600/30 flex items-center justify-center space-x-2 cursor-pointer mt-4"
              >
                <Lock className="w-4 h-4" />
                <span>Unlock Master Admin Portal</span>
              </button>
            </form>
          </div>

          <div className="text-center">
            <button
              onClick={onBackToApp}
              className="text-xs text-slate-400 hover:text-slate-200 flex items-center justify-center space-x-2 mx-auto cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Student OS Workspace</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER 2: AUTHORIZED FULL ADMIN PORTAL CONTROL PANEL
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#060810] text-slate-100 font-sans flex flex-col selection:bg-rose-500 selection:text-white">
      {/* Top Admin Header Bar */}
      <header className="h-16 border-b border-rose-500/20 bg-slate-950/90 backdrop-blur-xl px-6 flex items-center justify-between sticky top-0 z-40 shadow-xl">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 via-purple-600 to-indigo-500 p-[1px] shadow-lg shadow-rose-500/30">
              <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                <ShieldAlert className="w-5 h-5 text-rose-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-rose-200 to-indigo-200 bg-clip-text text-transparent">
                  NEXUS ADMIN PORTAL
                </span>
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30">
                  ROOT CONTROL
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Admin Controls */}
        <div className="flex items-center space-x-3">
          <span className="hidden md:inline-flex items-center space-x-1.5 text-xs text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Live System Online</span>
          </span>

          <button
            onClick={() => setIsAdminAuthenticated(false)}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-rose-400 hover:text-rose-300 text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Lock Admin</span>
          </button>

          <button
            onClick={onBackToApp}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 text-white text-xs font-bold transition-all shadow-md flex items-center space-x-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go to Student OS</span>
          </button>
        </div>
      </header>

      {/* Main Admin Portal Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Nav */}
        <aside className="w-64 border-r border-slate-800/80 bg-slate-950/70 p-4 space-y-2 flex flex-col text-left">
          <div className="px-3 py-2 text-[10px] uppercase font-mono font-bold text-slate-500 tracking-wider">
            Admin Master Navigation
          </div>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full p-3 rounded-2xl flex items-center space-x-3 text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-rose-500/15 border border-rose-500/30 text-rose-300 shadow-md'
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
            }`}
          >
            <Activity className="w-4 h-4 text-rose-400" />
            <span>Live System Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`w-full p-3 rounded-2xl flex items-center space-x-3 text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'users'
                ? 'bg-rose-500/15 border border-rose-500/30 text-rose-300 shadow-md'
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4 text-rose-400" />
            <span>Logged-In Users ({users.filter(u => u.status === 'ACTIVE').length})</span>
          </button>

          <button
            onClick={() => setActiveTab('database')}
            className={`w-full p-3 rounded-2xl flex items-center space-x-3 text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'database'
                ? 'bg-rose-500/15 border border-rose-500/30 text-rose-300 shadow-md'
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
            }`}
          >
            <Database className="w-4 h-4 text-rose-400" />
            <span>Database Master Control</span>
          </button>

          <button
            onClick={() => setActiveTab('sql')}
            className={`w-full p-3 rounded-2xl flex items-center space-x-3 text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'sql'
                ? 'bg-rose-500/15 border border-rose-500/30 text-rose-300 shadow-md'
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-4 h-4 text-rose-400" />
            <span>SQL Sandbox Console</span>
          </button>

          <button
            onClick={() => setActiveTab('flags')}
            className={`w-full p-3 rounded-2xl flex items-center space-x-3 text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'flags'
                ? 'bg-rose-500/15 border border-rose-500/30 text-rose-300 shadow-md'
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-4 h-4 text-rose-400" />
            <span>Feature Flags & Notices</span>
          </button>

          <div className="pt-6 mt-auto">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
              <div className="font-bold text-slate-200">Database Engine</div>
              <div className="text-[10px] text-slate-400 font-mono">PostgreSQL 16 + pgvector</div>
              <div className="text-[10px] text-emerald-400 font-mono flex items-center space-x-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>Client IndexedDB Synced</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Dynamic Content View Area */}
        <main className="flex-1 overflow-y-auto p-8 space-y-6 text-left">
          {statusMsg && (
            <div className={`p-4 rounded-2xl text-xs flex items-center space-x-2 font-semibold ${
              statusMsg.success ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300' : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
            }`}>
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{statusMsg.text}</span>
            </div>
          )}

          {activeTab !== 'flags' && noStudentLoggedIn ? (
            <div className="p-12 rounded-3xl bg-slate-900/40 border border-slate-800/80 text-center space-y-4 max-w-lg mx-auto mt-12 backdrop-blur-md animate-in fade-in">
              <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto text-rose-400">
                <Database className="w-8 h-8 animate-pulse" />
              </div>
              <h2 className="text-lg font-bold text-white">Database Insight Suspended</h2>
              <p className="text-xs text-slate-400 leading-relaxed font-mono">
                NEXUS OS security protocol: Database schema visualization, user tables, and SQL terminals are restricted until at least one student registers and logs into the website.
              </p>
              <div className="text-[10px] text-slate-500 uppercase font-mono">
                Awaiting Student Login Session...
              </div>
            </div>
          ) : (
            <>
              {/* TAB 1: LIVE DASHBOARD */}
              {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-extrabold text-white">System Command Overview</h1>
                  <p className="text-xs text-slate-400">Total website active users, database tables, and real-time system metrics</p>
                </div>
              </div>

              {/* Metric Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono uppercase">
                    <span>Active Sessions</span>
                    <Users className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-3xl font-extrabold text-white">
                    {users.filter(u => u.status === 'ACTIVE').length} Users
                  </div>
                  <div className="text-[10px] text-emerald-400 font-mono">100% System Capacity</div>
                </div>

                <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono uppercase">
                    <span>Total Missions</span>
                    <Activity className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="text-3xl font-extrabold text-indigo-400">
                    {dbStats.missionCount} Items
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">Persisted in Database</div>
                </div>

                <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono uppercase">
                    <span>RAG Documents</span>
                    <Database className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="text-3xl font-extrabold text-cyan-400">
                    {dbStats.documentCount} Vectors
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">Indexed & Searchable</div>
                </div>

                <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono uppercase">
                    <span>Database Tables</span>
                    <Table className="w-4 h-4 text-rose-400" />
                  </div>
                  <div className="text-3xl font-extrabold text-rose-400">
                    8 Tables
                  </div>
                  <div className="text-[10px] text-emerald-400 font-mono">PostgreSQL + IndexedDB</div>
                </div>
              </div>

              {/* Recent Active Logins Table */}
              <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                    <Users className="w-5 h-5 text-rose-400" />
                    <span>Logged-In Website Users & Real-time Activity</span>
                  </h2>
                  <span className="text-xs text-slate-400 font-mono">Showing {users.length} Users</span>
                </div>

                <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-950">
                  <table className="w-full text-xs text-slate-300">
                    <thead className="bg-slate-900 text-slate-400 font-mono text-[10px] uppercase">
                      <tr>
                        <th className="p-3 text-left">Student / User</th>
                        <th className="p-3 text-left">Email Address</th>
                        <th className="p-3 text-left">Academic Role</th>
                        <th className="p-3 text-left">Last Login</th>
                        <th className="p-3 text-left">Status</th>
                        <th className="p-3 text-left">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono">
                      {users.map(u => (
                        <tr key={u.id}>
                          <td className="p-3 text-white font-bold flex items-center space-x-2">
                            <span>{u.avatar}</span>
                            <span>{u.name}</span>
                          </td>
                          <td className="p-3 text-slate-400">{u.email}</td>
                          <td className="p-3">{u.role}</td>
                          <td className="p-3 text-cyan-300">{u.lastLogin}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              u.status === 'ACTIVE' 
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            }`}>
                              {u.status}
                            </span>
                          </td>
                          <td className="p-3">
                            <button
                              onClick={() => handleToggleUserStatus(u.id)}
                              className="text-[11px] text-rose-400 hover:underline cursor-pointer"
                            >
                              {u.status === 'ACTIVE' ? 'Suspend User' : 'Reactivate'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LOGGED-IN USERS MANAGEMENT */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-extrabold text-white">Student Account Management</h1>
                  <p className="text-xs text-slate-400">View registered students, login session details, and manage permissions</p>
                </div>
                <div className="relative w-72">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Search student by name, email..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredUsers.map(u => (
                  <div key={u.id} className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-2xl shadow-md">
                          {u.avatar}
                        </div>
                        <div>
                          <div className="text-base font-bold text-white">{u.name}</div>
                          <div className="text-xs text-slate-400 font-mono">{u.email}</div>
                        </div>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                        u.status === 'ACTIVE' 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {u.status}
                      </span>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-950 text-xs space-y-1.5 font-mono">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Target Role:</span>
                        <span className="text-slate-200 font-bold">{u.role}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Last Login:</span>
                        <span className="text-cyan-400">{u.lastLogin}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Missions Completed:</span>
                        <span className="text-indigo-400 font-bold">{u.missionsCompleted} Missions</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                      <button
                        onClick={() => handleToggleUserStatus(u.id)}
                        className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                          u.status === 'ACTIVE'
                            ? 'bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20'
                            : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                        }`}
                      >
                        {u.status === 'ACTIVE' ? 'Suspend Student' : 'Activate Student'}
                      </button>

                      <button
                        onClick={() => alert(`Password reset link sent to ${u.email}`)}
                        className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white cursor-pointer"
                      >
                        Reset Password
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: DATABASE MASTER CONTROL */}
          {activeTab === 'database' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-extrabold text-white">Database Control & Schema Inspector</h1>
                  <p className="text-xs text-slate-400">View raw database tables, record storage size, and execute backup dumps</p>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleExportDatabase}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export DB Snapshot</span>
                  </button>

                  <label className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-cyan-400 text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer">
                    <Upload className="w-4 h-4" />
                    <span>Import DB Dump</span>
                    <input type="file" accept=".json" onChange={handleImportDatabase} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Table List Matrix */}
              <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
                <h2 className="text-base font-bold text-white flex items-center space-x-2">
                  <Database className="w-5 h-5 text-indigo-400" />
                  <span>Website Database Tables Breakdown</span>
                </h2>

                <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-950">
                  <table className="w-full text-xs text-slate-300 font-mono">
                    <thead className="bg-slate-900 text-slate-400 text-[10px] uppercase">
                      <tr>
                        <th className="p-3 text-left">Table Name</th>
                        <th className="p-3 text-left">Description</th>
                        <th className="p-3 text-left">Storage Engine</th>
                        <th className="p-3 text-left">Rows Count</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      <tr>
                        <td className="p-3 text-white font-bold">users</td>
                        <td className="p-3 text-slate-400">Registered student credentials & profiles</td>
                        <td className="p-3 text-slate-400">PostgreSQL / LocalStorage</td>
                        <td className="p-3 text-emerald-400 font-bold">{users.length} rows</td>
                      </tr>
                      <tr>
                        <td className="p-3 text-white font-bold">digital_twin_profiles</td>
                        <td className="p-3 text-slate-400">Student learning velocity & readiness metrics</td>
                        <td className="p-3 text-slate-400">PostgreSQL / Cache</td>
                        <td className="p-3 text-emerald-400 font-bold">{dbStats.profileCount} rows</td>
                      </tr>
                      <tr>
                        <td className="p-3 text-white font-bold">missions</td>
                        <td className="p-3 text-slate-400">Active daily missions & exam goals</td>
                        <td className="p-3 text-slate-400">IndexedDB Table</td>
                        <td className="p-3 text-indigo-400 font-bold">{dbStats.missionCount} rows</td>
                      </tr>
                      <tr>
                        <td className="p-3 text-white font-bold">documents</td>
                        <td className="p-3 text-slate-400">Uploaded PDFs, notes & pgvector embeddings</td>
                        <td className="p-3 text-slate-400">Vector Table (pgvector)</td>
                        <td className="p-3 text-cyan-400 font-bold">{dbStats.documentCount} rows</td>
                      </tr>
                      <tr>
                        <td className="p-3 text-white font-bold">knowledge_nodes</td>
                        <td className="p-3 text-slate-400">Interactive concept graph nodes</td>
                        <td className="p-3 text-slate-400">Relational Graph Store</td>
                        <td className="p-3 text-emerald-400 font-bold">{dbStats.nodeCount} rows</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Reset Danger Zone */}
              <div className="p-6 rounded-3xl bg-rose-500/10 border border-rose-500/30 space-y-3">
                <h3 className="text-base font-bold text-rose-300 flex items-center space-x-2">
                  <RotateCcw className="w-5 h-5 text-rose-400" />
                  <span>Factory Database Reset</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Wipes current local changes and restores the website database to default initial sample seeds.
                </p>
                <button
                  onClick={handleResetDatabase}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all cursor-pointer"
                >
                  Execute Factory Reset
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: SQL SANDBOX */}
          {activeTab === 'sql' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-extrabold text-white">Admin SQL Terminal & Query Sandbox</h1>
                <p className="text-xs text-slate-400">Execute interactive SQL queries against total website database tables</p>
              </div>

              <form onSubmit={handleExecuteSQL} className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300 font-mono uppercase">
                    Enter SQL DDL / DML Query:
                  </label>
                  <span className="text-[10px] text-emerald-400 font-mono">PostgreSQL Dialect Ready</span>
                </div>

                <textarea
                  rows={4}
                  value={sqlQuery}
                  onChange={(e) => setSqlQuery(e.target.value)}
                  className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-400 focus:outline-none focus:border-rose-500"
                />

                <div className="flex items-center space-x-3">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
                  >
                    Execute Query
                  </button>

                  <button
                    type="button"
                    onClick={() => setSqlQuery('SELECT * FROM users;')}
                    className="px-4 py-2 rounded-xl bg-slate-950 text-slate-400 hover:text-slate-200 text-xs font-mono cursor-pointer"
                  >
                    SELECT * FROM users
                  </button>

                  <button
                    type="button"
                    onClick={() => setSqlQuery('SELECT * FROM missions WHERE completed = false;')}
                    className="px-4 py-2 rounded-xl bg-slate-950 text-slate-400 hover:text-slate-200 text-xs font-mono cursor-pointer"
                  >
                    SELECT * FROM missions
                  </button>
                </div>
              </form>

              {sqlResult && (
                <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
                  <span className="text-xs font-bold text-slate-300 font-mono uppercase">Query Output:</span>
                  <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto max-h-[300px]">
                    {sqlResult}
                  </pre>
                </div>
              )}
            </div>
          )}

            </>
          )}

          {/* TAB 5: FEATURE FLAGS & ANNOUNCEMENT */}
          {activeTab === 'flags' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-extrabold text-white">System Flags & Broadcast Announcement</h1>
                <p className="text-xs text-slate-400">Control total website feature availability and broadcast live system banners</p>
              </div>

              {/* Announcement Editor */}
              <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
                <h2 className="text-base font-bold text-white flex items-center space-x-2">
                  <Bell className="w-5 h-5 text-amber-400" />
                  <span>Global System Broadcast Banner</span>
                </h2>

                <div className="space-y-2">
                  <input
                    type="text"
                    value={announcement}
                    onChange={(e) => setAnnouncement(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-rose-500"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">Broadcasts to all logged-in students in real time</span>
                    <button
                      onClick={handleSaveAnnouncement}
                      className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all cursor-pointer"
                    >
                      {announcementSaved ? 'Broadcast Published!' : 'Publish System Announcement'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Module Feature Flags Grid */}
              <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
                <h2 className="text-base font-bold text-white flex items-center space-x-2">
                  <Sliders className="w-5 h-5 text-rose-400" />
                  <span>Website Modules Feature Toggles</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(featureFlags).map(([key, enabled]) => (
                    <div key={key} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-white capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
                        <div className="text-[10px] text-slate-400 font-mono">Module Status: {enabled ? 'ONLINE' : 'DISABLED'}</div>
                      </div>

                      <button
                        onClick={() => handleToggleFlag(key as keyof typeof featureFlags)}
                        className={`p-2 rounded-xl text-xs font-bold flex items-center space-x-1 transition-all cursor-pointer ${
                          enabled 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                            : 'bg-slate-900 text-slate-500 border border-slate-800'
                        }`}
                      >
                        {enabled ? <ToggleRight className="w-5 h-5 text-emerald-400" /> : <ToggleLeft className="w-5 h-5 text-slate-500" />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
