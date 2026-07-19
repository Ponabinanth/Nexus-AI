import React, { useState } from 'react';
import { Heart, Moon, Coffee, Activity, ShieldCheck, Sparkles, CheckCircle2, RefreshCw } from 'lucide-react';
import { DigitalTwinProfile } from '../types';

interface LifeOSProps {
  profile: DigitalTwinProfile;
}

export const LifeOS: React.FC<LifeOSProps> = ({ profile }) => {
  const [sleepHours, setSleepHours] = useState(7);
  const [hydrationLiters, setHydrationLiters] = useState(2);
  const [stressLevel, setStressLevel] = useState(5); // 1-10 scale, starting at neutral mid
  const [notes, setNotes] = useState('');
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);

  const calculateResilience = () => {
    let score = 100;
    if (sleepHours < 6) score -= 25;
    if (hydrationLiters < 2) score -= 15;
    score -= stressLevel * 5;
    return Math.max(score, 30);
  };

  const resilienceScore = calculateResilience();
  const burnoutRisk = resilienceScore < 50 ? 'High Risk' : resilienceScore < 75 ? 'Moderate' : 'Low (Optimal)';

  const handleRecalculate = () => {
    let advice = `Based on ${sleepHours}h sleep, ${hydrationLiters}L water, and stress level ${stressLevel}/10: `;
    if (sleepHours < 6.5) {
      advice += '⚠️ Sleep deficit detected. Aim for 7.5h tonight to restore cognitive focus before exam sprints. ';
    } else {
      advice += '✓ Excellent sleep pacing! Memory consolidation rate is optimal. ';
    }
    if (stressLevel > 6) {
      advice += '🧘 High stress alert. Wellness Agent recommends taking a 15-minute walk or Pomodoro break now.';
    } else {
      advice += '🌱 Mental resilience state is balanced. Maintain current study sprint rhythm.';
    }
    setAiAdvice(advice);
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300 text-left">
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white flex items-center space-x-2">
            <Heart className="w-6 h-6 text-rose-400" />
            <span>Life Operating System & Burnout Radar</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Beyond academics. Balances sleep schedules, study pacing, mental wellness, side projects, and habits.
          </p>
        </div>

        <div className={`px-3.5 py-1.5 rounded-full border text-xs font-semibold flex items-center space-x-1.5 ${
          resilienceScore >= 75 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' :
          resilienceScore >= 50 ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' :
          'bg-rose-500/10 border-rose-500/30 text-rose-300'
        }`}>
          <ShieldCheck className="w-4 h-4" />
          <span>Burnout Risk: {burnoutRisk}</span>
        </div>
      </div>

      {/* Interactive Inputs Grid */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Daily Wellness & Pacing Tracker
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-bold">Sleep (Hours / Night):</span>
              <Moon className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-xl font-bold text-white">{sleepHours} hrs</div>
            <input
              type="range"
              min="3"
              max="11"
              step="0.5"
              value={sleepHours}
              onChange={(e) => setSleepHours(parseFloat(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-bold">Hydration (Liters / Day):</span>
              <Coffee className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-xl font-bold text-amber-400">{hydrationLiters} L</div>
            <input
              type="range"
              min="0.5"
              max="5.0"
              step="0.5"
              value={hydrationLiters}
              onChange={(e) => setHydrationLiters(parseFloat(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-bold">Stress Level (1-10):</span>
              <Activity className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-xl font-bold text-rose-400">{stressLevel} / 10</div>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={stressLevel}
              onChange={(e) => setStressLevel(parseInt(e.target.value))}
              className="w-full accent-rose-500 cursor-pointer"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add daily feeling or notes (e.g. feeling tired after DP coding)..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none"
          />
          <button
            onClick={handleRecalculate}
            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md shadow-rose-600/30 flex items-center justify-center space-x-1.5 shrink-0 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Recalculate AI Advice</span>
          </button>
        </div>

        {aiAdvice && (
          <div className="p-4 rounded-2xl bg-slate-950 border border-rose-500/30 text-xs text-slate-200 leading-relaxed font-medium animate-in fade-in">
            {aiAdvice}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Sleep Pacing Target</span>
            <Moon className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{sleepHours} hrs / night</div>
          <div className="text-[10px] text-emerald-400 font-medium">{sleepHours >= 7 ? '✓ Healthy sleep target' : sleepHours >= 6 ? '⚠ Slightly below optimal' : '🚨 Sleep deficit detected'}</div>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Hydration & Sprints</span>
            <Coffee className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-amber-400">{hydrationLiters} L / day</div>
          <div className="text-[10px] text-amber-400 font-medium">{hydrationLiters >= 2.5 ? '✓ Well hydrated today' : '⚠ Drink more water'}</div>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Mental Resilience Score</span>
            <Activity className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-extrabold text-rose-400">{resilienceScore} / 100</div>
          <div className="text-[10px] text-rose-400 font-medium">Wellness Agent active</div>
        </div>
      </div>
    </div>
  );
};

