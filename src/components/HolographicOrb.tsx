import React from 'react';
import { Sparkles, Bot, Cpu } from 'lucide-react';

interface HolographicOrbProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  statusText?: string;
  isListening?: boolean;
  isThinking?: boolean;
  className?: string;
}

export const HolographicOrb: React.FC<HolographicOrbProps> = ({
  size = 'md',
  statusText,
  isListening = false,
  isThinking = false,
  className = ''
}) => {
  const sizeDimensions = {
    sm: 'w-10 h-10',
    md: 'w-24 h-24',
    lg: 'w-40 h-40',
    xl: 'w-64 h-64 md:w-80 md:h-80'
  };

  const currentSize = sizeDimensions[size];

  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      {/* Outer Blurred Glow Aura */}
      <div 
        className={`absolute rounded-full bg-gradient-to-tr from-purple-600 via-indigo-500 to-cyan-400 blur-2xl opacity-50 ${currentSize} ${
          isThinking ? 'animate-ping' : 'animate-orb-pulse'
        }`}
      />

      {/* Main 3D Holographic Orb Container */}
      <div className={`relative rounded-full p-[2px] bg-gradient-to-tr from-purple-500 via-cyan-400 to-indigo-600 shadow-2xl shadow-purple-500/40 ${currentSize}`}>
        {/* Rotating Outer Ring */}
        <div className="absolute inset-0 rounded-full border border-cyan-400/40 animate-orb-rotate pointer-events-none" />

        {/* Inner Glass Core */}
        <div className="w-full h-full rounded-full bg-slate-950/90 backdrop-blur-xl flex items-center justify-center relative overflow-hidden">
          {/* Internal Plasma Waves */}
          <div className="absolute w-[140%] h-[140%] bg-gradient-to-br from-purple-600/40 via-cyan-500/30 to-indigo-600/40 rounded-full animate-orb-rotate opacity-70 blur-md" />
          
          {/* Secondary Counter-Rotating Ring */}
          <div className="absolute inset-2 rounded-full border border-purple-400/30 animate-spin pointer-events-none" style={{ animationDirection: 'reverse', animationDuration: '8s' }} />

          {/* Central Glowing AI Core */}
          <div className="relative z-10 flex flex-col items-center justify-center text-white">
            {size === 'xl' || size === 'lg' ? (
              <div className="space-y-1 text-center">
                <div className="w-12 h-12 md:w-16 md:h-16 mx-auto rounded-2xl bg-gradient-to-tr from-purple-500 to-cyan-400 p-[1px] shadow-lg shadow-purple-500/50">
                  <div className="w-full h-full bg-slate-950 rounded-[15px] flex items-center justify-center">
                    <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-cyan-300 animate-pulse" />
                  </div>
                </div>
              </div>
            ) : size === 'md' ? (
              <Sparkles className="w-8 h-8 text-cyan-300 animate-pulse" />
            ) : (
              <Bot className="w-5 h-5 text-cyan-300" />
            )}
          </div>
        </div>
      </div>

      {/* Optional Status Text / Wave Indicator */}
      {statusText && (
        <div className="mt-3 flex items-center space-x-2 text-xs font-mono font-bold text-cyan-300 bg-slate-900/80 px-3.5 py-1 rounded-full border border-cyan-500/30 shadow-md">
          {isListening && (
            <div className="flex items-center space-x-1 h-3">
              <span className="w-1 bg-cyan-400 rounded-full animate-siri-wave-1"></span>
              <span className="w-1 bg-purple-400 rounded-full animate-siri-wave-2"></span>
              <span className="w-1 bg-indigo-400 rounded-full animate-siri-wave-3"></span>
              <span className="w-1 bg-cyan-300 rounded-full animate-siri-wave-4"></span>
            </div>
          )}
          <span>{statusText}</span>
        </div>
      )}
    </div>
  );
};
