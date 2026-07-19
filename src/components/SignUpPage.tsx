import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Lock, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  Cpu, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  BadgeCheck
} from 'lucide-react';
import { apiService } from '../services/api';

interface SignUpPageProps {
  onSignUpSuccess: (name: string, email: string, avatar: string, userId?: string) => void;
  onNavigateToLogin: () => void;
  onNavigateToLanding: () => void;
}

export const SignUpPage: React.FC<SignUpPageProps> = ({
  onSignUpSuccess,
  onNavigateToLogin,
  onNavigateToLanding
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('👩‍🎓');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const avatarOptions = ['👩‍🎓', '👨‍💻', '👩‍🔬', '🧑‍🎓', '🚀', '🧠'];

  // Check password strength
  const getPasswordStrength = () => {
    if (!password) return { label: 'Empty', color: 'text-slate-500', percent: 0 };
    if (password.length < 6) return { label: 'Weak', color: 'text-rose-400', percent: 33 };
    if (password.length < 10) return { label: 'Good', color: 'text-amber-400', percent: 66 };
    return { label: 'Strong', color: 'text-emerald-400', percent: 100 };
  };

  const strength = getPasswordStrength();
  const passwordsMatch = password.length > 0 && confirmPassword.length > 0 && password === confirmPassword;
  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('Please enter your full student name.');
      return;
    }
    if (!email.trim()) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setError('Please enter a password.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter your password.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const result = await apiService.signUp(name.trim(), email.trim(), password, selectedAvatar);
      if (result.success) {
        onSignUpSuccess(name.trim(), email.trim(), selectedAvatar, result.user?.id);
      } else {
        setError(result.message || 'Registration failed. Email may already be registered.');
      }
    } catch (err) {
      setError('Unable to connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060812] text-slate-100 font-sans flex items-center justify-center p-4 relative overflow-hidden text-left selection:bg-emerald-500 selection:text-white">
      {/* Background Matrix & Emerald Holographic Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[500px] bg-gradient-to-tr from-emerald-600/20 via-indigo-600/15 to-purple-600/15 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute top-10 left-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-[110px] pointer-events-none"></div>

      <div className="w-full max-w-lg relative z-10 space-y-6">
        {/* Top Header Identity */}
        <div className="text-center space-y-2">
          <div 
            onClick={onNavigateToLanding} 
            className="inline-flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-400 via-indigo-500 to-purple-600 p-[1px] shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-all">
              <div className="w-full h-full bg-slate-950 rounded-[15px] flex items-center justify-center">
                <Cpu className="w-6 h-6 text-emerald-400 animate-pulse" />
              </div>
            </div>
            <div className="text-left">
              <div className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-white via-emerald-200 to-indigo-200 bg-clip-text text-transparent">
                NEXUS AI
              </div>
              <div className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest">
                Student OS Badge Generator
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-400">Create your unique AI Academic Twin identity and unlock all OS capabilities</p>
        </div>

        {/* Sign Up Card with Distinct Matrix Cyber Badge Styling */}
        <div className="p-8 rounded-3xl bg-slate-900/85 border border-emerald-500/30 shadow-2xl shadow-emerald-500/10 backdrop-blur-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                <BadgeCheck className="w-5 h-5 text-emerald-400" />
                <span>Create Student Account</span>
              </h2>
              <span className="text-[11px] text-slate-400">Join the unified AI Operating System</span>
            </div>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-mono">
              Sign Up Studio
            </span>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Avatar Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                <span>Choose Student Avatar Persona:</span>
                <span className="text-[11px] text-emerald-400 font-mono">{selectedAvatar} Selected</span>
              </label>
              <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-950 border border-slate-800">
                {avatarOptions.map((av) => (
                  <button
                    key={av}
                    type="button"
                    onClick={() => setSelectedAvatar(av)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all ${
                      selectedAvatar === av
                        ? 'bg-emerald-500/20 border-2 border-emerald-400 scale-110 shadow-md shadow-emerald-500/20'
                        : 'bg-slate-900 border border-slate-800 hover:bg-slate-800 opacity-70'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>

            {/* Field 1: Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                <User className="w-3.5 h-3.5 text-emerald-400" />
                <span>Full Name</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Abi Sundar"
                className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 focus:border-emerald-500/60 text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-all"
                required
              />
            </div>

            {/* Field 2: Student Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                <span>Email Address</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="abi.student@university.edu"
                className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 focus:border-emerald-500/60 text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-all"
                required
              />
            </div>

            {/* Field 3: Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Password</span>
                </label>
                {password && (
                  <span className={`text-[10px] font-mono uppercase font-bold ${strength.color}`}>
                    Strength: {strength.label}
                  </span>
                )}
              </div>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create strong password (min 6 chars)"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 focus:border-emerald-500/60 text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-all pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password Strength Indicator Bar */}
              {password && (
                <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${
                      strength.percent <= 33 ? 'bg-rose-500' : strength.percent <= 66 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${strength.percent}%` }}
                  />
                </div>
              )}
            </div>

            {/* Field 4: Re-enter Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Re-enter Password</span>
                </label>
                {passwordsMatch && (
                  <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>Passwords Match</span>
                  </span>
                )}
                {passwordsMismatch && (
                  <span className="text-[10px] font-mono text-rose-400 font-bold flex items-center space-x-1">
                    <XCircle className="w-3 h-3 text-rose-400" />
                    <span>Passwords Do Not Match</span>
                  </span>
                )}
              </div>

              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type password to verify"
                  className={`w-full px-4 py-3 rounded-2xl bg-slate-950 border text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-all pr-12 ${
                    passwordsMismatch 
                      ? 'border-rose-500/60 focus:border-rose-500' 
                      : passwordsMatch 
                      ? 'border-emerald-500/60 focus:border-emerald-500' 
                      : 'border-slate-800 focus:border-emerald-500/60'
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={loading || passwordsMismatch}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:opacity-90 disabled:opacity-50 text-white text-xs font-extrabold uppercase tracking-wider transition-all shadow-lg shadow-emerald-600/30 flex items-center justify-center space-x-2 cursor-pointer mt-4"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                  <span>Generating Digital Twin Identity...</span>
                </>
              ) : (
                <>
                  <span>Create Account & Start Operating System</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Bottom Switch to Login */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center text-xs text-slate-400">
          <span>Already registered on NEXUS AI? </span>
          <button
            onClick={onNavigateToLogin}
            className="font-bold text-emerald-400 hover:underline ml-1 cursor-pointer"
          >
            Sign In to Existing Account (Login)
          </button>
        </div>
      </div>
    </div>
  );
};
