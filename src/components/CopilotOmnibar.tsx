import React, { useState, useEffect } from 'react';
import { Sparkles, Command, Mic, X, ArrowRight, Bot, CheckCircle2, Zap } from 'lucide-react';
import { queryMultiAgent } from '../services/aiEngine';
import { ChatMessage } from '../types';

interface CopilotOmnibarProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: string) => void;
}

export const CopilotOmnibar: React.FC<CopilotOmnibarProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<ChatMessage | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else window.dispatchEvent(new CustomEvent('open-omnibar'));
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleExecute = async (inputPrompt: string) => {
    const textToRun = inputPrompt || query;
    if (!textToRun.trim()) return;

    setLoading(true);
    setResponse(null);

    const res = await queryMultiAgent(textToRun, 'copilot');
    setResponse(res);
    setLoading(false);
  };

  const sampleCommands = [
    { label: '"I have a Java placement test in 5 days and a DBMS assignment tomorrow"', tab: 'mission-control' },
    { label: '"Build a Spring Boot Microservice Inventory System architecture"', tab: 'coding-lab' },
    { label: '"Start 5-minute Mock Interview for Amazon SDE-1"', tab: 'placement-hub' },
    { label: '"Explain 0/1 Knapsack Dynamic Programming with DP Matrix"', tab: 'ai-chat' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-start justify-center pt-20 px-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-slate-900 border border-indigo-500/30 rounded-2xl shadow-2xl shadow-indigo-500/20 overflow-hidden flex flex-col">
        {/* Top Input Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center space-x-3 bg-slate-950/60">
          <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleExecute(query)}
            placeholder="Type any command, prompt, or academic need..."
            className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-sm focus:outline-none"
            autoFocus
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-slate-500 hover:text-slate-300">
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => handleExecute(query)}
            disabled={loading || !query.trim()}
            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center space-x-1 shrink-0"
          >
            <span>Run</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Dynamic Content Area */}
        <div className="p-5 max-h-[60vh] overflow-y-auto space-y-4 text-left">
          {loading && (
            <div className="py-8 flex flex-col items-center justify-center space-y-3">
              <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin"></div>
              <span className="text-xs text-indigo-400 font-mono animate-pulse">Orchestrating Tutor, Planner & Coding Agents...</span>
            </div>
          )}

          {response && !loading && (
            <div className="space-y-4 animate-in slide-in-from-bottom-2 duration-200">
              <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-400">
                <Bot className="w-4 h-4" />
                <span>NEXUS OS Execution Output</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 leading-relaxed whitespace-pre-line">
                {response.text}
              </div>

              {response.suggestedActions && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {response.suggestedActions.map((act, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleExecute(act)}
                      className="px-3 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 hover:bg-indigo-500/20 text-xs font-medium transition-colors"
                    >
                      {act}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {!response && !loading && (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-3">
                Quick Copilot Commands
              </div>
              <div className="space-y-2">
                {sampleCommands.map((cmd, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setQuery(cmd.label.replace(/"/g, ''));
                      handleExecute(cmd.label.replace(/"/g, ''));
                    }}
                    className="p-3 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800/60 hover:border-indigo-500/40 text-xs text-slate-300 cursor-pointer flex items-center justify-between group transition-all"
                  >
                    <div className="flex items-center space-x-2.5">
                      <Zap className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
                      <span>{cmd.label}</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-950 border-t border-slate-800/80 px-5 flex items-center justify-between text-[11px] text-slate-500">
          <span>Press ESC to dismiss</span>
          <span>Powered by OpenAI & Groq Multi-Agent Framework</span>
        </div>
      </div>
    </div>
  );
};
