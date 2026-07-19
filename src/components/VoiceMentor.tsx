import React, { useState } from 'react';
import { Mic, MicOff, Volume2, Sparkles, Send } from 'lucide-react';
import { queryMultiAgent } from '../services/aiEngine';
import { HolographicOrb } from './HolographicOrb';

export const VoiceMentor: React.FC = () => {
  const [listening, setListening] = useState(false);
  const [userPrompt, setUserPrompt] = useState('');
  const [transcript, setTranscript] = useState('');
  const [aiVoiceReply, setAiVoiceReply] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[*#`]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText.substring(0, 300));
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleRunVoiceConversation = async (promptToUse?: string) => {
    const textToAsk = promptToUse || userPrompt;
    if (!textToAsk.trim() || processing) return;

    setListening(true);
    setProcessing(true);
    setTranscript(textToAsk);

    setTimeout(async () => {
      setListening(false);
      const res = await queryMultiAgent(textToAsk, 'tutor');
      setAiVoiceReply(res.text);
      setProcessing(false);
      speakText(res.text);
    }, 1200);
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300 text-left selection:bg-purple-500 selection:text-white">
      <div className="neo-glass-card p-6 border-purple-500/20 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-xl md:text-2xl font-bold text-white flex items-center space-x-3">
            <Mic className="w-6 h-6 text-cyan-400" />
            <span>Live Voice Mentor (Siri / Vision Pro Conversational Mode)</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Talk naturally with NEXUS AI. Real-time Speech-to-Text & Neural Audio Synthesis.
          </p>
        </div>
      </div>

      <div className="neo-glass-card p-10 md:p-12 text-center space-y-8 border-purple-500/30 relative overflow-hidden">
        {/* 3D Holographic AI Orb with Siri Wave */}
        <HolographicOrb 
          size="xl" 
          statusText={listening ? 'Listening to your voice...' : processing ? 'Synthesizing voice response...' : 'Voice AI Standing By'} 
          isListening={listening}
          isThinking={processing}
          className="mx-auto"
        />

        {/* Siri-like Wave Animation Lines */}
        <div className="flex items-center justify-center space-x-2 h-10">
          <span className="w-1 bg-cyan-400 rounded-full animate-siri-wave-1"></span>
          <span className="w-1 bg-purple-400 rounded-full animate-siri-wave-2"></span>
          <span className="w-1 bg-indigo-400 rounded-full animate-siri-wave-3"></span>
          <span className="w-1 bg-cyan-300 rounded-full animate-siri-wave-4"></span>
          <span className="w-1 bg-purple-500 rounded-full animate-siri-wave-5"></span>
        </div>

        <button
          onClick={() => handleRunVoiceConversation()}
          disabled={processing}
          className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto transition-all shadow-xl cursor-pointer ${
            listening || processing
              ? 'bg-rose-600 shadow-rose-600/40 animate-ping' 
              : 'bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 shadow-purple-600/40 hover:scale-105'
          }`}
        >
          {listening || processing ? <MicOff className="w-8 h-8 text-white" /> : <Mic className="w-8 h-8 text-white" />}
        </button>

        {/* Input Bar */}
        <div className="max-w-md mx-auto flex items-center space-x-2 bg-slate-950 border border-purple-500/30 rounded-2xl p-2 shadow-2xl">
          <input
            type="text"
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleRunVoiceConversation()}
            placeholder="Type your spoken question..."
            className="flex-1 bg-transparent px-3 text-xs text-slate-100 focus:outline-none font-mono"
          />
          <button
            onClick={() => handleRunVoiceConversation()}
            disabled={processing || !userPrompt.trim()}
            className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition-all text-xs font-bold cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        {transcript && (
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-200 max-w-lg mx-auto font-mono">
            <span className="text-purple-400 font-bold">You asked:</span> "{transcript}"
          </div>
        )}

        {aiVoiceReply && (
          <div className="p-6 rounded-3xl neo-glass-card border-purple-500/30 text-xs text-purple-200 max-w-xl mx-auto space-y-3 animate-in fade-in text-left">
            <div className="flex items-center justify-between font-bold text-cyan-300 border-b border-white/10 pb-3 font-mono">
              <div className="flex items-center space-x-2">
                <Volume2 className="w-4 h-4 text-cyan-400 animate-bounce" />
                <span>Voice Mentor AI Response:</span>
              </div>
              <button
                onClick={() => speakText(aiVoiceReply)}
                className="text-[10px] px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 hover:bg-purple-500/40 cursor-pointer"
              >
                🔊 Replay Audio
              </button>
            </div>
            <p className="leading-relaxed whitespace-pre-line font-mono">{aiVoiceReply}</p>
          </div>
        )}
      </div>
    </div>
  );
};
