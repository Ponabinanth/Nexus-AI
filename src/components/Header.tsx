import React from 'react';
import { 
  Cpu, 
  Sparkles, 
  Home,
  ShieldAlert,
  LogOut,
  User
} from 'lucide-react';
import { DigitalTwinProfile } from '../types';

interface HeaderProps {
  profile: DigitalTwinProfile;
  onOpenOmnibar: () => void;
  onOpenVoice?: () => void;
  onOpenLanding: () => void;
  onOpenLogin: () => void;
  onOpenSignUp: () => void;
  onOpenAdminPortal: () => void;
  onLogout?: () => void;
  activeTab: string;
  currentUser?: { id: string; name: string; email: string; avatar: string; role: string } | null;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  onOpenOmnibar,
  onOpenLanding,
  onOpenLogin,
  onOpenSignUp,
  onOpenAdminPortal,
  onLogout,
  activeTab,
  currentUser
}) => {
  const isLoggedIn = !!currentUser;

  return (
    <header className="h-16 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl px-6 flex items-center justify-between sticky top-0 z-30 shadow-md">
      {/* Left: Brand Identity & Active Context */}
      <div className="flex items-center space-x-4">
        <div 
          onClick={onOpenLanding} 
          className="flex items-center space-x-3 group cursor-pointer" 
          title="Go to NEXUS AI Landing Showcase"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 group-hover:scale-105 transition-all duration-300">
            <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
              <Cpu className="w-5 h-5 text-indigo-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-200 bg-clip-text text-transparent">
                NEXUS AI
              </span>
              <span className="text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Student OS
              </span>
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center text-xs text-slate-400 space-x-2 pl-4 border-l border-slate-800">
          <span className="capitalize text-slate-300 font-medium">{activeTab.replace(/-/g, ' ')}</span>
          {isLoggedIn && (
            <>
              <span>•</span>
              <span className="flex items-center space-x-1.5 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>Online</span>
              </span>
            </>
          )}
        </div>
      </div>

      {/* Middle: Academic Copilot Search / Command Bar */}
      <div className="flex-1 max-w-xl mx-6 hidden sm:block">
        <button
          onClick={onOpenOmnibar}
          className="w-full h-10 px-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 text-slate-400 hover:text-slate-200 text-sm flex items-center justify-between transition-all duration-200 group shadow-inner"
        >
          <div className="flex items-center space-x-2.5">
            <Sparkles className="w-4 h-4 text-indigo-400 group-hover:rotate-12 transition-transform" />
            <span className="truncate">Ask Academic Copilot or execute command...</span>
          </div>
          <div className="flex items-center space-x-1.5 text-xs text-slate-500 font-mono">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px]">Ctrl</kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px]">K</kbd>
          </div>
        </button>
      </div>

      {/* Right: Actions & User Profile */}
      <div className="flex items-center space-x-2">
        {/* Showcase toggle */}
        <button
          onClick={onOpenLanding}
          className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all flex items-center space-x-1.5 text-xs font-semibold cursor-pointer"
          title="Back to Landing Page Showcase"
        >
          <Home className="w-3.5 h-3.5 text-indigo-400" />
          <span className="hidden sm:inline">Showcase</span>
        </button>

        {/* Admin Portal trigger */}
        <button
          onClick={onOpenAdminPortal}
          className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 hover:text-white transition-all flex items-center space-x-1.5 text-xs font-bold cursor-pointer"
          title="Open Master Admin Control Portal & Database Center"
        >
          <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
          <span className="hidden sm:inline">Admin</span>
        </button>

        {/* Auth Section */}
        <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
          {isLoggedIn ? (
            <>
              {/* Logged-in user avatar & name */}
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-base shadow-md">
                  {currentUser.avatar}
                </div>
                <div className="hidden xl:block text-left">
                  <div className="text-xs font-bold text-slate-200 leading-tight">{currentUser.name}</div>
                  <div className="text-[10px] text-slate-400 truncate max-w-[100px]">{currentUser.email}</div>
                </div>
              </div>
              {/* Logout */}
              <button
                onClick={onLogout}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-rose-500/20 border border-slate-800 hover:border-rose-500/30 text-slate-400 hover:text-rose-300 text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1.5"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onOpenLogin}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/60 text-cyan-400 hover:text-cyan-300 text-xs font-bold transition-all cursor-pointer"
                title="Sign In"
              >
                Login
              </button>
              <button
                onClick={onOpenSignUp}
                className="px-3 py-1.5 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-sm shadow-emerald-500/20 cursor-pointer"
                title="Create Account"
              >
                Sign Up
              </button>
              {/* Guest avatar */}
              <div className="flex items-center space-x-2 pl-2 border-l border-slate-800/60">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-700 to-slate-600 flex items-center justify-center shadow-md">
                  <User className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
