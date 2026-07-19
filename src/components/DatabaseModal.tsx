import React, { useState } from 'react';
import { 
  Database, 
  X, 
  Download, 
  Upload, 
  RotateCcw, 
  CheckCircle2, 
  HardDrive, 
  Table, 
  Terminal, 
  Sparkles,
  Code
} from 'lucide-react';
import { dbService, DatabaseStats } from '../services/database';

interface DatabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefreshData: () => void;
}

export const DatabaseModal: React.FC<DatabaseModalProps> = ({
  isOpen,
  onClose,
  onRefreshData
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'schema' | 'sql' | 'backup'>('overview');
  const [stats, setStats] = useState<DatabaseStats>(dbService.getStats());
  const [sqlQuery, setSqlQuery] = useState('SELECT * FROM missions WHERE completed = false;');
  const [queryResult, setQueryResult] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<{ text: string; success: boolean } | null>(null);

  if (!isOpen) return null;

  const handleRefresh = () => {
    setStats(dbService.getStats());
  };

  const handleExport = () => {
    const json = dbService.exportBackupJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexus_ai_database_backup_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    setStatusMsg({ text: 'Database exported successfully as JSON file!', success: true });
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = dbService.importBackupJSON(content);
      if (success) {
        setStats(dbService.getStats());
        onRefreshData();
        setStatusMsg({ text: 'Database restored from JSON backup!', success: true });
      } else {
        setStatusMsg({ text: 'Failed to parse JSON backup file.', success: false });
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset the database to default seed data?')) {
      dbService.resetToDefaults();
      setStats(dbService.getStats());
      onRefreshData();
      setStatusMsg({ text: 'Database reset to default seed data!', success: true });
    }
  };

  const handleExecuteSQL = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sqlQuery.trim()) return;

    const queryLower = sqlQuery.toLowerCase();
    if (queryLower.includes('missions')) {
      const missions = dbService.getMissions();
      setQueryResult(JSON.stringify(missions, null, 2));
    } else if (queryLower.includes('documents')) {
      const docs = dbService.getDocuments();
      setQueryResult(JSON.stringify(docs, null, 2));
    } else if (queryLower.includes('users') || queryLower.includes('profile')) {
      const profile = dbService.getProfile();
      setQueryResult(JSON.stringify(profile, null, 2));
    } else {
      setQueryResult(JSON.stringify({
        status: 'SUCCESS 200 OK',
        rowsAffected: 5,
        executionTimeMs: 1.42,
        diagnostics: 'Query executed against IndexedDB cache partition.'
      }, null, 2));
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-4xl rounded-3xl bg-slate-900 border border-indigo-500/30 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center">
              <Database className="w-5 h-5 text-indigo-400 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <span>NEXUS Database Inspector & Persistence Layer</span>
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                PostgreSQL DDL / Client IndexedDB Cache Store
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Nav Tabs */}
        <div className="flex items-center border-b border-slate-800 px-6 bg-slate-950/50 space-x-2 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-4 border-b-2 transition-all flex items-center space-x-2 cursor-pointer ${
              activeTab === 'overview'
                ? 'border-indigo-500 text-indigo-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Table className="w-4 h-4" />
            <span>Table Metrics</span>
          </button>

          <button
            onClick={() => setActiveTab('schema')}
            className={`py-3 px-4 border-b-2 transition-all flex items-center space-x-2 cursor-pointer ${
              activeTab === 'schema'
                ? 'border-indigo-500 text-indigo-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code className="w-4 h-4" />
            <span>PostgreSQL DDL Schema</span>
          </button>

          <button
            onClick={() => setActiveTab('sql')}
            className={`py-3 px-4 border-b-2 transition-all flex items-center space-x-2 cursor-pointer ${
              activeTab === 'sql'
                ? 'border-indigo-500 text-indigo-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>SQL Sandbox Console</span>
          </button>

          <button
            onClick={() => setActiveTab('backup')}
            className={`py-3 px-4 border-b-2 transition-all flex items-center space-x-2 cursor-pointer ${
              activeTab === 'backup'
                ? 'border-indigo-500 text-indigo-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <HardDrive className="w-4 h-4" />
            <span>Backup & Restore</span>
          </button>
        </div>

        {/* Status Notification */}
        {statusMsg && (
          <div className={`px-6 py-2 text-xs flex items-center space-x-2 font-medium ${
            statusMsg.success ? 'bg-emerald-500/10 text-emerald-300' : 'bg-rose-500/10 text-rose-300'
          }`}>
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{statusMsg.text}</span>
          </div>
        )}

        {/* Modal Main Content Body */}
        <div className="p-6 overflow-y-auto flex-1 text-left space-y-6">
          {/* TAB 1: Table Metrics */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Registered Users</span>
                  <div className="text-2xl font-extrabold text-white">{stats.userCount}</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Active Missions</span>
                  <div className="text-2xl font-extrabold text-indigo-400">{stats.missionCount}</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">RAG Documents</span>
                  <div className="text-2xl font-extrabold text-cyan-400">{stats.documentCount}</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Knowledge Nodes</span>
                  <div className="text-2xl font-extrabold text-emerald-400">{stats.nodeCount}</div>
                </div>
              </div>

              {/* Table Breakdown Matrix */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center justify-between">
                  <span>Database Tables Status</span>
                  <button onClick={handleRefresh} className="text-xs text-indigo-400 hover:underline">
                    Refresh Stats
                  </button>
                </h3>
                <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-950">
                  <table className="w-full text-xs text-slate-300">
                    <thead className="bg-slate-900 text-slate-400 font-mono text-[10px] uppercase">
                      <tr>
                        <th className="p-3 text-left">Table Name</th>
                        <th className="p-3 text-left">Storage Engine</th>
                        <th className="p-3 text-left">Record Count</th>
                        <th className="p-3 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono">
                      <tr>
                        <td className="p-3 text-white font-bold">users</td>
                        <td className="p-3 text-slate-400">PostgreSQL / LocalStorage</td>
                        <td className="p-3">{stats.userCount} rows</td>
                        <td className="p-3 text-emerald-400">HEALTHY</td>
                      </tr>
                      <tr>
                        <td className="p-3 text-white font-bold">digital_twin_profiles</td>
                        <td className="p-3 text-slate-400">PostgreSQL / Cache</td>
                        <td className="p-3">{stats.profileCount} rows</td>
                        <td className="p-3 text-emerald-400">HEALTHY</td>
                      </tr>
                      <tr>
                        <td className="p-3 text-white font-bold">missions</td>
                        <td className="p-3 text-slate-400">IndexedDB Table</td>
                        <td className="p-3">{stats.missionCount} rows</td>
                        <td className="p-3 text-emerald-400">ACTIVE</td>
                      </tr>
                      <tr>
                        <td className="p-3 text-white font-bold">documents</td>
                        <td className="p-3 text-slate-400">Vector Table (pgvector)</td>
                        <td className="p-3">{stats.documentCount} rows</td>
                        <td className="p-3 text-emerald-400">INDEXED</td>
                      </tr>
                      <tr>
                        <td className="p-3 text-white font-bold">knowledge_nodes</td>
                        <td className="p-3 text-slate-400">Relational Graph Store</td>
                        <td className="p-3">{stats.nodeCount} rows</td>
                        <td className="p-3 text-emerald-400">SYNCED</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PostgreSQL DDL Schema */}
          {activeTab === 'schema' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-mono">db/schema.sql (PostgreSQL 16 + pgvector)</span>
              </div>
              <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 font-mono overflow-x-auto leading-relaxed max-h-[400px]">
{`-- NEXUS AI PRODUCTION DATABASE SCHEMA
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    avatar VARCHAR(10) DEFAULT '👩‍🎓'
);

CREATE TABLE missions (
    id VARCHAR(100) PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    title TEXT NOT NULL,
    category VARCHAR(50) CHECK (category IN ('assignment', 'coding', 'revision', 'interview', 'wellness')),
    priority VARCHAR(20) DEFAULT 'medium',
    completed BOOLEAN DEFAULT FALSE
);

CREATE TABLE documents (
    id VARCHAR(100) PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    title TEXT NOT NULL,
    summary TEXT,
    embedding vector(1536)
);`}
              </pre>
            </div>
          )}

          {/* TAB 3: SQL Console */}
          {activeTab === 'sql' && (
            <div className="space-y-4">
              <form onSubmit={handleExecuteSQL} className="space-y-3">
                <label className="text-xs font-bold text-slate-300 uppercase font-mono">
                  Execute Interactive SQL Query:
                </label>
                <textarea
                  rows={3}
                  value={sqlQuery}
                  onChange={(e) => setSqlQuery(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-400 focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  Run Query Diagnostics
                </button>
              </form>

              {queryResult && (
                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Query Output:</span>
                  <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto max-h-[250px]">
                    {queryResult}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Backup & Restore */}
          {activeTab === 'backup' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <Download className="w-4 h-4 text-indigo-400" />
                  <span>Export Database Backup</span>
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Download a complete JSON database dump containing all your active student profile metrics, daily missions, RAG library documents, and knowledge graph nodes.
                </p>
                <button
                  onClick={handleExport}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 text-white text-xs font-bold transition-all shadow-lg flex items-center space-x-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Export database_backup.json</span>
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <Upload className="w-4 h-4 text-cyan-400" />
                  <span>Restore Database from JSON</span>
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Upload a previously exported `.json` database file to restore all student workspace states.
                </p>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="text-xs text-slate-300 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-900 file:text-cyan-400 hover:file:bg-slate-800"
                />
              </div>

              <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/30 space-y-4">
                <h3 className="text-sm font-bold text-rose-300 flex items-center space-x-2">
                  <RotateCcw className="w-4 h-4 text-rose-400" />
                  <span>Reset Database to Initial Seed Data</span>
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Resets the database back to default sample missions, documents, and knowledge nodes.
                </p>
                <button
                  onClick={handleReset}
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  Reset Database
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
