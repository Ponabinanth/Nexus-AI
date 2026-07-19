import React, { useState } from 'react';
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  Cpu, 
  ShieldCheck, 
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { apiService } from '../services/api';

interface LoginPageProps {
  onLoginSuccess: (email: string, name?: string, userId?: string, avatar?: string) => void;
  onNavigateToSignUp: () => void;
  onNavigateToLanding: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onNavigateToSignUp,
  onNavigateToLanding
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please fill in both email and password fields.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const result = await apiService.login(email.trim(), password);
      if (result.success && result.user) {
        onLoginSuccess(
          result.user.email,
          result.user.name,
          result.user.id,
          result.user.avatar
        );
      } else {
        setError(result.message || 'Invalid email or password. Please try again.');
      }
    } catch (err) {
      setError('Unable to connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05070c] text-slate-100 font-sans flex items-center justify-center p-4 relative overflow-hidden text-left selection:bg-cyan-500 selection:text-white">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-cyan-600/20 via-indigo-600/15 to-purple-600/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute top-10 left-10 w-60 h-60 bg-purple-500/8 rounded-full blur-[80px] pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand */}
        <div className="text-center space-y-2">
          <div
            onClick={onNavigateToLanding}
            className="inline-flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 p-[1px] shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-all">
              <div className="w-full h-full bg-slate-950 rounded-[15px] flex items-center justify-center">
                <Cpu className="w-6 h-6 text-cyan-400 animate-pulse" />
              </div>
            </div>
            <div className="text-left">
              <div className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-white via-slate-200 to-cyan-300 bg-clip-text text-transparent">
                NEXUS AI
              </div>
              <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
                Student OS — Secure Login
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-1">Sign in to access your personalized AI workspace</p>
        </div>

        {/* Login Card */}
        <div className="p-8 rounded-3xl bg-slate-900/80 border border-cyan-500/20 shadow-2xl shadow-cyan-500/5 backdrop-blur-2xl space-y-5">
          <div className="flex items-center space-x-2 pb-4 border-b border-slate-800">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="text-lg font-bold text-white">Welcome back</h2>
              <p className="text-[11px] text-slate-400">Enter your registered email & password</p>
            </div>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                <Mail className="w-3.5 h-3.5 text-cyan-400" />
                <span>Email Address</span>
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@university.edu"
                className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 focus:border-cyan-500/60 text-sm text-slate-100 placeholder-slate-600 focus:outline-none transition-all"
                required
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                <Lock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Password</span>
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 focus:border-cyan-500/60 text-sm text-slate-100 placeholder-slate-600 focus:outline-none transition-all pr-12"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:opacity-90 disabled:opacity-50 text-white text-sm font-extrabold tracking-wide transition-all shadow-lg shadow-cyan-600/30 flex items-center justify-center space-x-2 cursor-pointer mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Hint for admin */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-center space-y-1">
            <div className="text-[10px] text-slate-500 font-mono uppercase tracking-wider flex items-center justify-center space-x-1">
              <Sparkles className="w-3 h-3 text-purple-400" />
              <span>Admin Access</span>
            </div>
            <div className="text-[10px] text-slate-600 font-mono">
              admin@nexus.ai / admin2026!secret
            </div>
          </div>
        </div>

        {/* Switch to Sign Up */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center text-xs text-slate-400">
          <span>New to NEXUS AI? </span>
          <button
            id="go-to-signup"
            onClick={onNavigateToSignUp}
            className="font-bold text-cyan-400 hover:text-cyan-300 hover:underline ml-1 cursor-pointer transition-colors"
          >
            Create Student Account →
          </button>
        </div>

        {/* Back to Landing */}
        <div className="text-center">
          <button
            onClick={onNavigateToLanding}
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
          >
            ← Back to Landing
          </button>
        </div>
      </div>
    </div>
  );
};
