import React, { useState } from 'react';
import { 
  Sparkles, 
  Plus,
  X,
  CheckCircle2, 
  Circle, 
  Clock, 
  Zap, 
  Brain, 
  Code2, 
  BookOpen, 
  Briefcase, 
  AlertTriangle, 
  SlidersHorizontal,
  Flame,
  ArrowRight,
  ShieldCheck,
  Activity,
  Cpu,
  Database,
  Calendar,
  Check
} from 'lucide-react';
import { DigitalTwinProfile, MissionItem } from '../types';
import { HolographicOrb } from './HolographicOrb';
import { apiService } from '../services/api';

interface MissionControlProps {
  profile: DigitalTwinProfile;
  missions: MissionItem[];
  setMissions: React.Dispatch<React.SetStateAction<MissionItem[]>>;
  onNavigate: (tab: string) => void;
  userId?: string;
}

export const MissionControl: React.FC<MissionControlProps> = ({
  profile,
  missions,
  setMissions,
  onNavigate,
  userId
}) => {
  const [reordering, setReordering] = useState(false);
  const [suggestionAccepted, setSuggestionAccepted] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDuration, setNewTaskDuration] = useState('30');
  const [newTaskPriority, setNewTaskPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [newTaskDifficulty, setNewTaskDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [addingTask, setAddingTask] = useState(false);

  const handleAddMission = async () => {
    if (!newTaskTitle.trim()) return;
    setAddingTask(true);
    try {
      const newMission = await apiService.addMission({
        title: newTaskTitle.trim(),
        category: 'assignment',
        priority: newTaskPriority,
        difficulty: newTaskDifficulty,
        duration: `${newTaskDuration} min`,
        completed: false,
        userId: userId || 'guest'
      });
      setMissions(prev => [newMission, ...prev]);
      setNewTaskTitle('');
      setNewTaskDuration('30');
      setNewTaskPriority('medium');
      setNewTaskDifficulty('Medium');
      setShowAddForm(false);
    } catch (err) {
      console.error('Failed to add mission:', err);
    } finally {
      setAddingTask(false);
    }
  };

  const toggleMission = async (id: string) => {
    const mission = missions.find(m => m.id === id);
    if (!mission) return;
    const newCompleted = !mission.completed;
    setMissions(prev => prev.map(m => m.id === id ? { ...m, completed: newCompleted } : m));
    try {
      await apiService.updateMission(id, { completed: newCompleted });
    } catch {
      // Optimistic update already applied, ignore backend errors silently
    }
  };

  const autoAdjustSchedule = () => {
    setReordering(true);
    setTimeout(() => {
      const sorted = [...missions].sort((a, b) => {
        if (a.priority === 'high' && b.priority !== 'high') return -1;
        if (a.priority !== 'high' && b.priority === 'high') return 1;
        return 0;
      });
      setMissions(sorted);
      setReordering(false);
    }, 700);
  };

  const completedCount = missions.filter(m => m.completed).length;
  const totalMinutes = missions.reduce((acc, m) => acc + parseInt(m.duration), 0);

  // GitHub style 28-day contribution heatmap data
  const heatmapDays = Array.from({ length: 28 }, (_, i) => ({
    day: i + 1,
    intensity: i % 7 === 0 ? 0 : i % 5 === 0 ? 3 : i % 3 === 0 ? 2 : 1
  }));

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300 text-left selection:bg-purple-500 selection:text-white">
      {/* 1. Hero OS Greeting Banner with 3D Holographic AI Orb */}
      <div className="neo-glass-card p-6 md:p-8 relative overflow-hidden text-left border-purple-500/20 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono font-bold">
                <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-spin" />
                <span>NEXUS AI Academic Copilot • Online</span>
              </div>

              <button
                onClick={autoAdjustSchedule}
                disabled={reordering}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:opacity-90 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-lg shadow-purple-600/30 flex items-center space-x-2 cursor-pointer"
              >
                <SlidersHorizontal className={`w-3.5 h-3.5 ${reordering ? 'animate-spin' : ''}`} />
                <span>{reordering ? 'AI Optimizing Priorities...' : 'Auto-Adjust Schedule'}</span>
              </button>
            </div>

            <h1 className="font-heading text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
              👋 Welcome back, <span className="gradient-text-primary">{profile.name}</span>
            </h1>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-purple-500/20 space-y-2">
              <div className="text-xs font-mono font-bold text-cyan-300 flex items-center space-x-2">
                <Zap className="w-4 h-4 text-cyan-400" />
                <span>Today's AI Mission:</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-mono">
                {missions.length > 0
                  ? `${missions.filter(m => !m.completed).length} tasks remaining • Focus Score: ${profile.focusScore || 0}% • Keep going 🚀`
                  : 'No tasks yet — add your first mission to start your learning journey 🚀'
                }
              </p>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800">
                <div className="text-[10px] text-slate-400 font-mono uppercase">Estimated Time</div>
                <div className="text-base font-extrabold text-white mt-0.5">{Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800">
                <div className="text-[10px] text-slate-400 font-mono uppercase">Focus Score</div>
                <div className="text-base font-extrabold text-cyan-400 mt-0.5">{profile.focusScore}%</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800">
                <div className="text-[10px] text-slate-400 font-mono uppercase">Daily Streak</div>
                <div className="text-base font-extrabold text-amber-400 mt-0.5 flex items-center space-x-1">
                  <span>{profile.streakDays} Days</span>
                  <Flame className="w-4 h-4 text-amber-500 fill-amber-500/20" />
                </div>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800">
                <div className="text-[10px] text-slate-400 font-mono uppercase">Missions Done</div>
                <div className="text-base font-extrabold text-emerald-400 mt-0.5">{completedCount} / {missions.length}</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex items-center justify-center pt-4 lg:pt-0">
            <HolographicOrb size="lg" statusText="AI Twin Synced" />
          </div>
        </div>
      </div>

      {/* 2. Top AI Status Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="neo-glass-card-interactive p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono uppercase">
            <span>AI Confidence Score</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-400">96%</div>
          <div className="text-[10px] text-slate-400 font-mono">High Grounding Precision</div>
        </div>

        <div className="neo-glass-card-interactive p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono uppercase">
            <span>AI Memory Status</span>
            <Database className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-cyan-300">Synced</div>
          <div className="text-[10px] text-slate-400 font-mono">1,536 Vector Embeddings</div>
        </div>

        <div className="neo-glass-card-interactive p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono uppercase">
            <span>Active Agents</span>
            <Cpu className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-extrabold text-purple-300">7 Specialists</div>
          <div className="text-[10px] text-slate-400 font-mono">Multi-Agent Orchestration</div>
        </div>

        <div className="neo-glass-card-interactive p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono uppercase">
            <span>Brain Energy Meter</span>
            <Activity className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-amber-400">94%</div>
          <div className="text-[10px] text-slate-400 font-mono">Peak Cognitive Velocity</div>
        </div>
      </div>

      {/* 3. Proactive AI Suggestions Card */}
      <div className="neo-glass-card p-6 border-cyan-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start space-x-3.5">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5 text-cyan-400 animate-pulse" />
          </div>
          <div className="space-y-1">
            <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
              ⚡ AI noticed
            </div>
            <div className="text-sm font-bold text-white">
              You struggled with SQL joins & 3NF normalization yesterday during quiz practice.
            </div>
            <div className="text-xs text-slate-400">
              Would you like to practice 5 targeted SQL join questions now with immediate feedback?
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            setSuggestionAccepted(true);
            onNavigate('quiz-studio');
          }}
          className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:opacity-90 text-white text-xs font-extrabold uppercase tracking-wider transition-all shadow-lg shadow-cyan-500/20 flex items-center space-x-2 shrink-0 cursor-pointer"
        >
          {suggestionAccepted ? (
            <>
              <Check className="w-4 h-4 text-white" />
              <span>Launching Practice...</span>
            </>
          ) : (
            <>
              <span>Start 5 SQL Practice Questions</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {/* 4. Structured Main Grid: Today's Mission & AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Today's Mission Section */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading text-xl font-bold text-slate-100 flex items-center space-x-2">
                <span>Today's Mission</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 font-mono">
                  {missions.length} Tasks
                </span>
              </h2>
              <p className="text-xs text-slate-400">Add tasks and track your academic progress.</p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowAddForm(v => !v)}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white text-xs font-bold flex items-center space-x-1.5 transition-all shadow-md cursor-pointer"
              >
                {showAddForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                <span>{showAddForm ? 'Cancel' : 'Add Task'}</span>
              </button>
              <button 
                onClick={() => onNavigate('smart-planner')}
                className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center space-x-1 cursor-pointer"
              >
                <span>Planner</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Add Mission Form */}
          {showAddForm && (
            <div className="neo-glass-card p-5 space-y-3 border-purple-500/30 animate-in fade-in duration-200">
              <div className="text-xs font-mono font-bold text-purple-300 uppercase">⚡ New Task</div>
              <input
                type="text"
                value={newTaskTitle}
                onChange={e => setNewTaskTitle(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddMission()}
                placeholder="What do you need to accomplish today?"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-purple-500/50 text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-all"
                autoFocus
              />
              <div className="flex flex-wrap gap-3">
                <div className="space-y-1">
                  <div className="text-[10px] text-slate-400 font-mono uppercase">Duration (min)</div>
                  <input
                    type="number"
                    value={newTaskDuration}
                    onChange={e => setNewTaskDuration(e.target.value)}
                    className="w-24 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 focus:border-purple-500/40 text-xs text-slate-200 focus:outline-none"
                    min="5"
                    max="300"
                  />
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] text-slate-400 font-mono uppercase">Priority</div>
                  <select
                    value={newTaskPriority}
                    onChange={e => setNewTaskPriority(e.target.value as 'high' | 'medium' | 'low')}
                    className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 focus:border-purple-500/40 text-xs text-slate-200 focus:outline-none cursor-pointer"
                  >
                    <option value="high">🔴 High</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="low">🟢 Low</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] text-slate-400 font-mono uppercase">Difficulty</div>
                  <select
                    value={newTaskDifficulty}
                    onChange={e => setNewTaskDifficulty(e.target.value as 'Easy' | 'Medium' | 'Hard')}
                    className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 focus:border-purple-500/40 text-xs text-slate-200 focus:outline-none cursor-pointer"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>
              <button
                onClick={handleAddMission}
                disabled={!newTaskTitle.trim() || addingTask}
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer"
              >
                {addingTask ? <div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                <span>{addingTask ? 'Adding...' : 'Add Task to Mission'}</span>
              </button>
            </div>
          )}

          <div className="space-y-3">
            {missions.length === 0 && (
              <div className="p-10 rounded-2xl border-2 border-dashed border-slate-800 text-center space-y-3">
                <div className="text-3xl">📋</div>
                <div className="text-sm font-bold text-slate-300">No tasks yet</div>
                <div className="text-xs text-slate-500 font-mono">Click "Add Task" to create your first mission for today</div>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all cursor-pointer"
                >
                  + Create First Task
                </button>
              </div>
            )}
            {missions.map((mission) => (
              <div
                key={mission.id}
                onClick={() => toggleMission(mission.id)}
                className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between group ${
                  mission.completed 
                    ? 'bg-slate-950/40 border-slate-900 text-slate-500 opacity-60' 
                    : 'neo-glass-card-interactive border-slate-800 text-slate-200 hover:border-purple-500/40'
                }`}
              >
                <div className="flex items-center space-x-3.5">
                  <button className="focus:outline-none">
                    {mission.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-400/10" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-500 group-hover:text-purple-400 transition-colors" />
                    )}
                  </button>

                  <div>
                    <div className={`text-sm font-semibold ${mission.completed ? 'line-through' : 'text-slate-200'}`}>
                      {mission.title}
                    </div>
                    <div className="flex items-center space-x-3 mt-1 text-[11px] text-slate-400 font-mono">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>{mission.duration}</span>
                      </span>
                      {mission.difficulty && (
                        <span className={`px-2 py-0.2 rounded text-[10px] font-bold uppercase ${
                          mission.difficulty === 'Hard' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                          mission.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                          'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}>
                          {mission.difficulty}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase ${
                    mission.priority === 'high' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                    mission.priority === 'medium' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                    'bg-slate-800 text-slate-400'
                  }`}>
                    {mission.priority} Priority
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* GitHub-style Learning Contribution Heatmap */}
          <div className="neo-glass-card p-6 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-sm font-bold text-white flex items-center space-x-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>Learning Contribution Heatmap (Past 28 Days)</span>
              </h3>
              <span className="text-[10px] text-emerald-400 font-mono">Streak: {profile.streakDays} Days</span>
            </div>

            <div className="grid grid-cols-14 gap-1.5 pt-2">
              {heatmapDays.map(d => (
                <div
                  key={d.day}
                  className={`h-6 rounded-md transition-all ${
                    d.intensity === 3 ? 'bg-emerald-500 shadow-sm shadow-emerald-500/40' :
                    d.intensity === 2 ? 'bg-emerald-600/70' :
                    d.intensity === 1 ? 'bg-emerald-900/50 border border-emerald-500/20' :
                    'bg-slate-950 border border-slate-800'
                  }`}
                  title={`Day ${d.day}: ${d.intensity * 2} study hours`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Focus Mode & Upcoming Deadlines */}
        <div className="space-y-6">
          {/* Upcoming Deadlines Section */}
          <div className="neo-glass-card p-6 space-y-4">
            <h3 className="font-heading text-base font-bold text-white flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-purple-400" />
              <span>Upcoming Deadlines</span>
            </h3>

            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-slate-950/80 border border-amber-500/30 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">DBMS Normalization Assignment</div>
                  <div className="text-[10px] text-amber-400 font-mono">Due Tomorrow • 11:59 PM</div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 font-bold">
                  24h Left
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/80 border border-purple-500/30 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">Java 21 & Spring Boot Placement Test</div>
                  <div className="text-[10px] text-purple-300 font-mono">In 5 Days • Amazon SDE-1</div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30 font-bold">
                  5 Days
                </span>
              </div>
            </div>
          </div>

          {/* Quick OS Shortcuts */}
          <div className="neo-glass-card p-6 space-y-4">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">Quick OS Shortcuts</div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => onNavigate('ai-chat')}
                className="p-3.5 rounded-2xl bg-slate-950 hover:bg-purple-600/20 border border-slate-800 hover:border-purple-500/40 text-left transition-all group cursor-pointer"
              >
                <Brain className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform mb-1.5" />
                <div className="text-xs font-bold text-slate-200">Multi-Agent Chat</div>
                <div className="text-[10px] text-slate-500 font-mono">7 Specialized Agents</div>
              </button>

              <button
                onClick={() => onNavigate('placement-hub')}
                className="p-3.5 rounded-2xl bg-slate-950 hover:bg-rose-600/20 border border-slate-800 hover:border-rose-500/40 text-left transition-all group cursor-pointer"
              >
                <Briefcase className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform mb-1.5" />
                <div className="text-xs font-bold text-slate-200">Mock Interview</div>
                <div className="text-[10px] text-slate-500 font-mono">Amazon SDE Prep</div>
              </button>

              <button
                onClick={() => onNavigate('ai-library')}
                className="p-3.5 rounded-2xl bg-slate-950 hover:bg-cyan-600/20 border border-slate-800 hover:border-cyan-500/40 text-left transition-all group cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform mb-1.5" />
                <div className="text-xs font-bold text-slate-200">Upload Notes</div>
                <div className="text-[10px] text-slate-500 font-mono">PDF, PPT & Audio</div>
              </button>

              <button
                onClick={() => onNavigate('coding-lab')}
                className="p-3.5 rounded-2xl bg-slate-950 hover:bg-amber-600/20 border border-slate-800 hover:border-amber-500/40 text-left transition-all group cursor-pointer"
              >
                <Code2 className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform mb-1.5" />
                <div className="text-xs font-bold text-slate-200">Coding Lab</div>
                <div className="text-[10px] text-slate-500 font-mono">Complexity Review</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
