import React from 'react';
import { 
  LayoutDashboard, 
  Brain, 
  MessageSquare, 
  BookOpen, 
  Calendar, 
  GitFork, 
  Code2, 
  Briefcase, 
  Eye, 
  Mic, 
  HelpCircle, 
  Store,
  Users,
  Heart,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'mission-control', label: 'Mission Control', icon: LayoutDashboard, badge: 'Main' },
    { id: 'digital-twin', label: 'AI Digital Twin', icon: Brain, badge: 'Clone' },
    { id: 'ai-chat', label: 'Multi-Agent Chat', icon: MessageSquare, badge: '7 Agents' },
    { id: 'ai-library', label: 'AI Library & RAG', icon: BookOpen },
    { id: 'smart-planner', label: 'Smart Planner', icon: Calendar },
    { id: 'knowledge-graph', label: 'Knowledge Graph', icon: GitFork, badge: 'Graph' },
    { id: 'coding-lab', label: 'Live Coding Lab', icon: Code2 },
    { id: 'placement-hub', label: 'Placement Hub', icon: Briefcase, badge: 'Ready' },
    { id: 'vision-workspace', label: 'Vision Workspace', icon: Eye },
    { id: 'voice-mentor', label: 'Voice Mentor', icon: Mic },
    { id: 'quiz-studio', label: 'Quiz & AI Sandbox', icon: HelpCircle },
    { id: 'study-rooms', label: 'Global Study Rooms', icon: Users, badge: 'Live' },
    { id: 'life-os', label: 'Life OS & Wellness', icon: Heart, badge: 'Health' },
    { id: 'agent-marketplace', label: 'Agent Marketplace', icon: Store, badge: 'Market' },
  ];

  return (
    <aside className="w-64 border-r border-white/5 bg-[#050816]/80 backdrop-blur-2xl flex flex-col justify-between hidden md:flex shrink-0 select-none text-left">
      <div className="p-4 space-y-4 overflow-y-auto">
        <div>
          <div className="px-3 mb-2 text-[10px] font-bold font-mono tracking-widest uppercase text-slate-500 flex items-center justify-between">
            <span>Operating Modules</span>
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full h-10 px-3.5 rounded-2xl text-xs font-semibold flex items-center justify-between transition-all duration-200 cursor-pointer ${
                    isActive 
                      ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white shadow-lg shadow-purple-500/30 scale-[1.02]' 
                      : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center space-x-3 truncate">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-purple-400/70'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-mono font-bold uppercase ${
                      isActive 
                        ? 'bg-white/20 text-white' 
                        : 'bg-purple-500/10 text-purple-300 border border-purple-500/20'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer Banner */}
      <div className="p-4 m-3 neo-glass-card border-purple-500/20 text-left relative overflow-hidden">
        <div className="text-xs font-heading font-bold text-white mb-1">Academic Copilot Mode</div>
        <div className="text-[10px] text-slate-400 mb-2.5 leading-relaxed font-mono">
          AI continuously optimizes your schedules, homework & placement readiness.
        </div>
        <button 
          onClick={() => setActiveTab('digital-twin')}
          className="w-full py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white text-[10px] font-bold transition-all shadow-md flex items-center justify-center space-x-1 cursor-pointer"
        >
          <span>View Twin DNA</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
