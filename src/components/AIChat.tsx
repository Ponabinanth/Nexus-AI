import React, { useState } from 'react';
import { 
  Send, 
  Sparkles, 
  FileText, 
  Code, 
  Copy, 
  Check, 
  Zap,
  Mic,
  Bot
} from 'lucide-react';
import { AgentType, ChatMessage, DocumentItem } from '../types';
import { AGENT_PROMPTS, queryMultiAgent } from '../services/aiEngine';
import { HolographicOrb } from './HolographicOrb';

interface AIChatProps {
  documents: DocumentItem[];
  currentUser?: { id: string; name: string; email: string; avatar: string; role: string } | null;
}

export const AIChat: React.FC<AIChatProps> = ({ documents, currentUser }) => {
  const userName = currentUser?.name || 'Student';
  const userAvatar = currentUser?.avatar || '👩‍🎓';
  const [selectedAgent, setSelectedAgent] = useState<AgentType>('tutor');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'agent',
      agentId: 'tutor',
      agentName: 'Nexus Tutor',
      agentAvatar: '🎓',
      text: `Hello! I'm Nexus Tutor AI, grounded in your uploaded PDFs, slides, and lecture notes. Ask me anything about your subjects, and I'll provide personalized, context-aware guidance.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedActions: [
        'Explain a concept from my notes',
        'Generate quiz questions',
        'Help me write code',
        'Plan my study schedule'
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const toggleDocGrounding = (docTitle: string) => {
    setSelectedDocs(prev => 
      prev.includes(docTitle) ? prev.filter(d => d !== docTitle) : [...prev, docTitle]
    );
  };

  const handleSend = async (customPrompt?: string) => {
    const promptToSend = customPrompt || input;
    if (!promptToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: promptToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customPrompt) setInput('');
    setLoading(true);

    const agentResp = await queryMultiAgent(promptToSend, selectedAgent, selectedDocs);
    setMessages(prev => [...prev, agentResp]);
    setLoading(false);
  };

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const currentAgent = AGENT_PROMPTS[selectedAgent];

  const quickPrompts = [
    'Explain Spring Boot',
    'Generate Quiz',
    'Summarize PDF',
    'Review Resume'
  ];

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-[#050816] text-left overflow-hidden selection:bg-purple-500 selection:text-white">
      {/* Top Bar: Agent Selector & Grounded Context Toggle */}
      <div className="p-4 border-b border-white/10 bg-[#050816]/90 backdrop-blur-2xl space-y-3 shrink-0">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center space-x-3">
            <HolographicOrb size="sm" />
            <div>
              <h2 className="font-heading text-sm font-bold text-white flex items-center space-x-2">
                <span>{currentAgent.name}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 font-mono">
                  {currentAgent.badge}
                </span>
              </h2>
              <p className="text-[11px] text-slate-400 font-mono">{currentAgent.role}</p>
            </div>
          </div>

          {/* RAG Note Grounding Selector */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono text-slate-400 hidden sm:inline">RAG Memory Grounding:</span>
            <div className="flex flex-wrap gap-1.5 max-w-md">
              {documents.map((doc) => {
                const isSelected = selectedDocs.includes(doc.title);
                return (
                  <button
                    key={doc.id}
                    onClick={() => toggleDocGrounding(doc.title)}
                    className={`px-3 py-1 rounded-xl text-[10px] font-mono font-bold transition-all flex items-center space-x-1 cursor-pointer ${
                      isSelected 
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20' 
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    <FileText className="w-3 h-3 text-cyan-400" />
                    <span className="truncate max-w-[110px]">{doc.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 7 Agent Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
          {(Object.keys(AGENT_PROMPTS) as AgentType[])
            .filter(a => a !== 'copilot')
            .map((agentKey) => {
              const info = AGENT_PROMPTS[agentKey];
              const isActive = selectedAgent === agentKey;
              return (
                <button
                  key={agentKey}
                  onClick={() => setSelectedAgent(agentKey)}
                  className={`px-3.5 py-1.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center space-x-2 cursor-pointer ${
                    isActive 
                      ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white shadow-lg shadow-purple-500/30' 
                      : 'bg-slate-900/80 text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                  }`}
                >
                  <span>{info.avatar}</span>
                  <span>{info.name.replace('Nexus ', '')}</span>
                </button>
              );
            })}
        </div>
      </div>

      {/* Suggested Quick Prompt Pills */}
      <div className="px-6 py-2 bg-[#050816]/70 border-b border-white/5 flex items-center space-x-2 overflow-x-auto">
        <span className="text-[10px] font-mono text-purple-300 uppercase shrink-0">Quick AI Prompts:</span>
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p)}
            className="px-3 py-1 rounded-full bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 text-purple-300 hover:text-white text-xs font-mono transition-all shrink-0 cursor-pointer"
          >
            ⚡ {p}
          </button>
        ))}
      </div>

      {/* Chat Messages Feed */}
      <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start space-x-3 max-w-4xl ${
              msg.sender === 'user' ? 'ml-auto flex-row-reverse space-x-reverse' : ''
            }`}
          >
            {msg.sender === 'user' ? (
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-lg shrink-0 shadow-md">
                {userAvatar}
              </div>
            ) : (
              <HolographicOrb size="sm" className="shrink-0" />
            )}

            <div className={`space-y-3 max-w-2xl ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
              <div className="flex items-center space-x-2 text-[11px] text-slate-400 font-mono">
                <span className="font-bold text-slate-200">{msg.sender === 'user' ? userName : msg.agentName}</span>
                <span>•</span>
                <span>{msg.timestamp}</span>
                {msg.groundedDocs && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    Grounded Note ({msg.groundedDocs.length})
                  </span>
                )}
              </div>

              {/* Vision Pro style 32px rounded glass message card */}
              <div className={`p-5 rounded-[28px] text-xs md:text-sm leading-relaxed shadow-xl ${
                msg.sender === 'user' 
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-tr-none' 
                  : 'neo-glass-card text-slate-200 rounded-tl-none whitespace-pre-line border-purple-500/20'
              }`}>
                {msg.text}
              </div>

              {/* Code Snippet Card */}
              {msg.codeSnippet && (
                <div className="rounded-2xl overflow-hidden border border-purple-500/20 bg-slate-950 font-mono text-xs shadow-2xl">
                  <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-slate-400">
                    <div className="flex items-center space-x-2">
                      <Code className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="uppercase font-bold text-[10px] text-cyan-300">{msg.codeSnippet.language}</span>
                    </div>
                    <button
                      onClick={() => handleCopyCode(msg.codeSnippet!.code, msg.id)}
                      className="flex items-center space-x-1 text-[11px] text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                      {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="p-4 overflow-x-auto text-emerald-400 leading-relaxed">
                    <code>{msg.codeSnippet.code}</code>
                  </pre>
                </div>
              )}

              {/* Suggested Action Pills */}
              {msg.suggestedActions && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {msg.suggestedActions.map((action, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(action)}
                      className="px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 hover:border-purple-500/40 text-purple-300 hover:text-white text-xs font-semibold transition-all flex items-center space-x-1.5 cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      <span>{action}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-start space-x-3 max-w-2xl">
            <HolographicOrb size="sm" isThinking={true} className="shrink-0" />
            <div className="p-4 rounded-[28px] neo-glass-card border-purple-500/30 text-xs text-cyan-400 font-mono flex items-center space-x-2">
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></div>
              <span>{currentAgent.name} synthesizing multi-agent reasoning response...</span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Input Field */}
      <div className="p-4 border-t border-white/10 bg-[#050816]/90 backdrop-blur-2xl shrink-0">
        <div className="max-w-4xl mx-auto flex items-center space-x-3 bg-slate-950 border border-purple-500/30 focus-within:border-purple-500 rounded-3xl p-2 transition-all shadow-2xl">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`Ask ${currentAgent.name} anything about Spring Boot, quizzes, notes, or code...`}
            className="flex-1 bg-transparent px-4 text-xs md:text-sm text-slate-100 placeholder-slate-500 focus:outline-none font-mono"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="p-3 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:opacity-90 disabled:opacity-50 text-white transition-all shadow-lg shadow-purple-600/30 cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
