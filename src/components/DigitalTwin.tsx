import React, { useState } from 'react';
import { 
  Brain, 
  Target, 
  Zap, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Sparkles,
  Award,
  Sliders
} from 'lucide-react';
import { DigitalTwinProfile } from '../types';
import { queryMultiAgent } from '../services/aiEngine';

interface DigitalTwinProps {
  profile: DigitalTwinProfile;
}

export const DigitalTwin: React.FC<DigitalTwinProps> = ({ profile }) => {
  const [simulationPrompt, setSimulationPrompt] = useState('Will I be ready for Amazon SDE-1 in 6 months?');
  const [simulating, setSimulating] = useState(false);
  const [simResult, setSimResult] = useState<{
    readinessScore: number;
    confidence: string;
    weeklyTargetHours: number;
    gapsToClose: string[];
    roadmap: string[];
  } | null>(null);

  const runFutureSimulation = async () => {
    setSimulating(true);
    setSimResult(null);

    // Simulate future readiness calculation
    setTimeout(() => {
      setSimResult({
        readinessScore: 84,
        confidence: 'High (89% Projection Match)',
        weeklyTargetHours: 28,
        gapsToClose: [
          'Master 2D Dynamic Programming (Matrix Tabulation)',
          'System Design: LRU Cache & Distributed Rate Limiter',
          'Spring Boot Microservices Event Bus (Kafka basics)'
        ],
        roadmap: [
          'Weeks 1-4: Solidify Advanced Graph & DP algorithms',
          'Weeks 5-8: Complete 30 LeetCode Mediums & Mock Interviews',
          'Weeks 9-12: System Design Blueprints & Resume ATS Audit'
        ]
      });
      setSimulating(false);
    }, 1200);
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300 text-left">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 p-[1px] shadow-lg shadow-purple-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[15px] flex items-center justify-center text-2xl">
              {profile.avatar}
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl md:text-2xl font-bold text-white">AI Digital Twin: {profile.name}</h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30 font-semibold">
                Academic Clone Active
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Continuously modeling learning velocity, cognitive peaks, topic mastery, and placement readiness.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="text-right">
            <div className="text-[11px] text-slate-400">Target Role</div>
            <div className="text-xs font-bold text-indigo-300">{profile.targetRole}</div>
          </div>
        </div>
      </div>

      {/* Top 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Readiness Score</span>
            <Target className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{profile.readinessScore}%</div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${profile.readinessScore}%` }}></div>
          </div>
          <div className="text-[10px] text-emerald-400 font-medium">+4% from last week</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Learning Speed</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-amber-400">{profile.learningSpeedMultiplier}x</div>
          <div className="text-[11px] text-slate-400">Faster than benchmark average</div>
          <div className="text-[10px] text-amber-400 font-medium">Top 5% Student Velocity</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Peak Productivity</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-base font-bold text-cyan-300 mt-1">{profile.peakProductivityTime}</div>
          <div className="text-[11px] text-slate-400">Highest Focus & Accuracy Window</div>
          <div className="text-[10px] text-cyan-400 font-medium">AI schedules heavy tasks here</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Study Hours</span>
            <TrendingUp className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{profile.totalStudyHours} hrs</div>
          <div className="text-[11px] text-slate-400">Across 14 Active Days</div>
          <div className="text-[10px] text-purple-400 font-medium">10.1 hrs / week average</div>
        </div>
      </div>

      {/* ⭐ FUTURE SIMULATION ENGINE ⭐ */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/60 border border-purple-500/30 shadow-xl space-y-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <span>Future Simulation Engine</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono">Predictive AI</span>
            </h2>
            <p className="text-xs text-slate-400">Simulate your academic readiness and job placement timeline based on your Digital Twin parameters.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={simulationPrompt}
            onChange={(e) => setSimulationPrompt(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500/50"
            placeholder="Ask a future question e.g. Will I be ready for Amazon in 6 months?"
          />
          <button
            onClick={runFutureSimulation}
            disabled={simulating}
            className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-lg shadow-purple-600/30 flex items-center justify-center space-x-2 shrink-0 cursor-pointer"
          >
            <Brain className={`w-4 h-4 ${simulating ? 'animate-spin' : ''}`} />
            <span>{simulating ? 'Simulating Timeline...' : 'Run Simulation'}</span>
          </button>
        </div>

        {simResult && (
          <div className="p-6 rounded-2xl bg-slate-950/80 border border-purple-500/20 space-y-6 animate-in slide-in-from-bottom-2 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4 border-b border-slate-800">
              <div>
                <div className="text-xs text-slate-400">Predicted Readiness</div>
                <div className="text-3xl font-extrabold text-emerald-400 mt-1">{simResult.readinessScore}%</div>
              </div>
              <div>
                <div className="text-xs text-slate-400">Confidence Score</div>
                <div className="text-sm font-bold text-purple-300 mt-1">{simResult.confidence}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400">Recommended Pace</div>
                <div className="text-sm font-bold text-amber-300 mt-1">{simResult.weeklyTargetHours} hrs / week</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>Key Gaps to Close</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-300">
                  {simResult.gapsToClose.map((gap, i) => (
                    <li key={i} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-start space-x-2">
                      <span className="text-rose-400 font-bold">•</span>
                      <span>{gap}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3">
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-1">
                  <CheckCircle className="w-4 h-4" />
                  <span>Personalized Roadmap</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-300">
                  {simResult.roadmap.map((step, i) => (
                    <li key={i} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-start space-x-2">
                      <span className="text-emerald-400 font-bold">{i + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Grid: Weak vs Strong Topic Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Weak Topics */}
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-rose-400 uppercase tracking-wider flex items-center space-x-2">
              <AlertCircle className="w-4 h-4" />
              <span>Target Weak Topics</span>
            </h3>
            <span className="text-xs text-slate-500">Requires Revision</span>
          </div>

          <div className="space-y-3">
            {profile.weakTopics.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">{item.topic}</span>
                  <span className="font-mono text-rose-400 font-bold">{item.score}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-full rounded-full" style={{ width: `${item.score}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Strong Topics */}
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-2">
              <Award className="w-4 h-4" />
              <span>Mastered Strong Topics</span>
            </h3>
            <span className="text-xs text-slate-500">Exam Ready</span>
          </div>

          <div className="space-y-3">
            {profile.strongTopics.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">{item.topic}</span>
                  <span className="font-mono text-emerald-400 font-bold">{item.score}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${item.score}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
