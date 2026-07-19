import React, { useState } from 'react';
import { Store, Check, Plus, Star, Sparkles } from 'lucide-react';
import { COMMUNITY_AGENTS } from '../services/store';

export const AgentMarketplace: React.FC = () => {
  const [agents, setAgents] = useState(COMMUNITY_AGENTS);

  const toggleInstall = (id: string) => {
    setAgents(prev => prev.map(a => a.id === id ? { ...a, installed: !a.installed } : a));
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300 text-left">
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white flex items-center space-x-2">
            <Store className="w-6 h-6 text-indigo-400" />
            <span>Agent Marketplace & Custom Extensions</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Install community-published specialized agents into your NEXUS AI Operating System.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 transition-all flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  {agent.avatar}
                </div>
                <span className="text-xs font-bold text-amber-400 font-mono">{agent.rating}</span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white">{agent.name}</h3>
                <div className="text-[11px] text-indigo-400 font-semibold">{agent.role}</div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                {agent.desc}
              </p>
            </div>

            <button
              onClick={() => toggleInstall(agent.id)}
              className={`w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                agent.installed
                  ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30'
              }`}
            >
              {agent.installed ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Installed & Active</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Install Agent</span>
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
