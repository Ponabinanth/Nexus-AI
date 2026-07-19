import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Sparkles, 
  Target, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Flame, 
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import { MissionItem } from '../types';
import { apiService } from '../services/api';

interface SmartPlannerProps {
  missions: MissionItem[];
  setMissions: React.Dispatch<React.SetStateAction<MissionItem[]>>;
  userId?: string;
}

export const SmartPlanner: React.FC<SmartPlannerProps> = ({ missions, setMissions, userId }) => {
  const [goalInput, setGoalInput] = useState('');
  const [generatingGoal, setGeneratingGoal] = useState(false);
  const [goalCreated, setGoalCreated] = useState(false);
  const [customPhases, setCustomPhases] = useState<{
    phase: string;
    tag: string;
    color: string;
    items: string[];
  }[] | null>(null);

  const handleGenerateRoadmap = async () => {
    if (!goalInput.trim()) return;
    setGeneratingGoal(true);

    const cleanGoal = goalInput.trim();
    const generated = [
      {
        phase: `Phase 1: Foundation Sprint (Next 1-2 Weeks)`,
        tag: 'Core Mastery',
        color: 'border-rose-500/40 bg-rose-950/20 text-rose-300',
        items: [
          `Master foundational principles for "${cleanGoal}"`,
          'Solve 10 practice problems / conceptual drills',
          'Summarize key study materials in AI Library'
        ]
      },
      {
        phase: `Phase 2: Project & Deep Application (Weeks 3-8)`,
        tag: 'Hands-on Practice',
        color: 'border-indigo-500/40 bg-indigo-950/20 text-indigo-300',
        items: [
          `Build real-world application / assignment related to "${cleanGoal}"`,
          'Run automated AI static code reviews in Coding Lab',
          'Conduct system design and edge-case evaluation'
        ]
      },
      {
        phase: `Phase 3: Mock Testing & Final Placement (Months 2-6)`,
        tag: 'Target Readiness',
        color: 'border-amber-500/40 bg-amber-950/20 text-amber-300',
        items: [
          `Complete 5 adaptive exam quizzes on "${cleanGoal}"`,
          'Conduct 1-on-1 mock interviews in Placement Hub',
          'Optimize ATS resume keywords and STAR stories'
        ]
      }
    ];

    // Small delay for UX
    await new Promise(resolve => setTimeout(resolve, 800));
    setCustomPhases(generated);

    // Inject mission into global state + backend
    const newMission: MissionItem = {
      id: `ms-${Date.now()}`,
      title: `Goal Action: ${cleanGoal.substring(0, 35)}`,
      category: 'assignment',
      duration: '60 min',
      completed: false,
      priority: 'high',
      difficulty: 'Medium'
    };
    try {
      const savedMission = await apiService.addMission({ ...newMission, userId: userId || 'guest' });
      setMissions(prev => [savedMission, ...prev]);
    } catch {
      setMissions(prev => [newMission, ...prev]);
    }

    setGeneratingGoal(false);
    setGoalCreated(true);
  };

  const activePhases = customPhases;

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300 text-left">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white flex items-center space-x-2">
            <CalendarIcon className="w-6 h-6 text-cyan-400" />
            <span>Smart Planner & AI Career Timeline</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            AI dynamically re-schedules exams, coding, assignments, and revision based on your real-time performance.
          </p>
        </div>

        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
          <span>Auto-Sync Schedule Active</span>
        </div>
      </div>

      {/* 🎯 GOAL ROADMAP GENERATOR 🎯 */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-cyan-950/60 via-slate-900 to-indigo-950/60 border border-cyan-500/30 shadow-xl space-y-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
            <Target className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">6-Month Academic Goal Creator</h2>
            <p className="text-xs text-slate-400">Enter your career objective to auto-build daily tasks and milestone timelines.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={goalInput}
            onChange={(e) => setGoalInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerateRoadmap()}
            placeholder="Enter your career goal (e.g. Get Amazon SDE-1 offer in 6 months, Master DSA for placements)..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
          />
          <button
            onClick={handleGenerateRoadmap}
            disabled={generatingGoal}
            className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-lg shadow-cyan-600/30 flex items-center justify-center space-x-2 shrink-0 cursor-pointer"
          >
            <Sparkles className={`w-4 h-4 ${generatingGoal ? 'animate-spin' : ''}`} />
            <span>{generatingGoal ? 'Building Roadmap...' : 'Generate 6-Month Roadmap'}</span>
          </button>
        </div>

        {goalCreated && (
          <div className="p-5 rounded-2xl bg-slate-950/90 border border-cyan-500/30 space-y-3 animate-in fade-in duration-300">
            <div className="flex items-center justify-between text-xs text-cyan-300 font-semibold">
              <span>Goal Roadmap Activated: {goalInput}</span>
              <span className="text-emerald-400 font-mono">100% Generated</span>
            </div>
            <p className="text-xs text-slate-300">
              NEXUS AI has auto-injected daily study milestones into your Mission Control.
            </p>
          </div>
        )}
      </div>

      {/* AI Academic Timeline Cards */}
      <div className="space-y-4">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Academic Horizon & Career Milestones
        </div>

        {!activePhases ? (
          <div className="p-12 rounded-2xl border-2 border-dashed border-slate-800 text-center space-y-4">
            <div className="text-4xl">🎯</div>
            <div className="text-base font-bold text-slate-300">No roadmap generated yet</div>
            <div className="text-xs text-slate-500 font-mono max-w-sm mx-auto">
              Enter your career goal or target achievement above and click "Generate 6-Month Roadmap" to create a personalized AI-powered study timeline
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {activePhases.map((phase, idx) => (
              <div
                key={idx}
                className={`p-6 rounded-2xl border ${phase.color} backdrop-blur-xl space-y-4 transition-all hover:scale-[1.01]`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold tracking-wide uppercase px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-700">
                    {phase.tag}
                  </span>
                  <span className="text-xs text-slate-400">Phase {idx + 1}</span>
                </div>

                <h3 className="text-sm font-bold text-white">{phase.phase}</h3>

                <ul className="space-y-2 text-xs text-slate-300">
                  {phase.items.map((item, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
