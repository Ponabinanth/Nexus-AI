import React, { useState } from 'react';
import { Users, MessageSquare, Sparkles, Send, CheckCircle2, ShieldCheck } from 'lucide-react';

export const StudyRooms: React.FC = () => {
  const [activeRoom, setActiveRoom] = useState('java-concurrency');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'Abi', avatar: '👩‍🎓', text: 'How does Carrier thread pinning work in Virtual Threads when using synchronized blocks?', time: '10:14 AM' },
    { sender: 'Praveen', avatar: '👨‍💻', text: 'If you block inside a synchronized method, the virtual thread pins its carrier thread! Use ReentrantLock instead.', time: '10:16 AM' },
    { sender: 'Sarah', avatar: '👩‍🔬', text: 'Exactly! ReentrantLock allows carrier thread unmounting during I/O wait.', time: '10:18 AM' }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [aiSummary, setAiSummary] = useState<string | null>(null);

  const rooms = [
    { id: 'java-concurrency', name: 'Java 21 Virtual Threads & Concurrency', activeUsers: 14, tag: 'High Activity' },
    { id: 'dp-leetcode', name: 'LeetCode Hard DP & Knapsack Sprint', activeUsers: 22, tag: 'Placement Prep' },
    { id: 'dbms-workshop', name: 'DBMS Normalization & B-Tree Indexing', activeUsers: 9, tag: 'Assignment' }
  ];

  const handleSendMessage = () => {
    if (!inputMsg.trim()) return;
    setChatMessages(prev => [
      ...prev,
      { sender: 'Abi (You)', avatar: '👩‍🎓', text: inputMsg, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
    setInputMsg('');
  };

  const handleSummarizeRoom = () => {
    setAiSummary(
      "🤖 NEXUS AI Study Room Synthesis:\n\nKey Takeaways:\n1. Synchronized blocks pin Virtual Threads to carrier OS threads in Java 21.\n2. Best Practice: Replace synchronized keywords with ReentrantLock to enable non-blocking I/O thread unmounting.\n\nAuto-Generated Quiz Flashcard:\nQ: Why use ReentrantLock over synchronized in Java 21 virtual threads?\nA: ReentrantLock prevents carrier thread pinning during blocking operations."
    );
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300 text-left">
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/80 border border-slate-800">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white flex items-center space-x-2">
            <Users className="w-6 h-6 text-indigo-400" />
            <span>Global Study Rooms & Live AI Group Synthesis</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Join global peer study rooms. NEXUS AI automatically synthesizes meeting notes, translates languages, and outputs quizzes.
          </p>
        </div>

        <button
          onClick={handleSummarizeRoom}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 flex items-center space-x-1.5 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Summarize Room Discussion</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Room Selector */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Study Rooms</div>
          <div className="space-y-2.5">
            {rooms.map((rm) => (
              <div
                key={rm.id}
                onClick={() => setActiveRoom(rm.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-2 ${
                  activeRoom === rm.id 
                    ? 'bg-slate-900 border-indigo-500/60 shadow-lg' 
                    : 'glass-panel-interactive border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold text-white">
                  <span className="truncate max-w-[180px]">{rm.name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {rm.activeUsers} Live
                  </span>
                </div>
                <div className="text-[10px] text-indigo-400">{rm.tag}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Chat & Summary */}
        <div className="lg:col-span-2 space-y-4">
          {aiSummary && (
            <div className="p-4 rounded-2xl bg-indigo-950/80 border border-indigo-500/30 text-xs font-mono text-indigo-200 leading-relaxed whitespace-pre-line animate-in fade-in">
              {aiSummary}
            </div>
          )}

          <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 h-96 flex flex-col justify-between">
            <div className="space-y-3 overflow-y-auto pr-2">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className="flex items-start space-x-3 text-xs">
                  <span className="text-xl">{msg.avatar}</span>
                  <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-200 space-y-1">
                    <div className="flex items-center space-x-2 text-[10px] text-slate-400">
                      <span className="font-bold text-indigo-300">{msg.sender}</span>
                      <span>•</span>
                      <span>{msg.time}</span>
                    </div>
                    <div>{msg.text}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 flex items-center space-x-2 border-t border-slate-800">
              <input
                type="text"
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Share your doubt or code snippet with the study room..."
                className="flex-1 bg-slate-900 px-4 py-2 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none border border-slate-800"
              />
              <button
                onClick={handleSendMessage}
                className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
