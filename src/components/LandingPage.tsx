import React from 'react';
import { 
  Sparkles, 
  Cpu, 
  ArrowRight, 
  Brain, 
  ShieldCheck, 
  Zap, 
  Layers, 
  Code2, 
  Star,
  Bot,
  Play
} from 'lucide-react';
import { HolographicOrb } from './HolographicOrb';

interface LandingPageProps {
  onEnterOS: () => void;
  onNavigateToLogin: () => void;
  onNavigateToSignUp: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterOS,
  onNavigateToLogin,
  onNavigateToSignUp
}) => {
  const features = [
    {
      title: 'AI Digital Twin',
      desc: 'Models your exact learning velocity, peak productivity hours, and weak topics to auto-optimize study schedules.',
      icon: Brain,
      color: 'from-purple-500 to-indigo-600',
      badge: 'Personalized'
    },
    {
      title: '7 Specialized AI Agents',
      desc: 'Tutor, Planner, Coding Mentor, Research, Career, Productivity, and Wellness agents working in multi-agent orchestration.',
      icon: Bot,
      color: 'from-cyan-500 to-blue-600',
      badge: 'Multi-Agent'
    },
    {
      title: 'Interactive Knowledge Graph',
      desc: 'HTML5 canvas concept map connecting Java, DBMS, and DSA notes into a gamified visual skill tree.',
      icon: Layers,
      color: 'from-emerald-500 to-teal-600',
      badge: 'Visual Memory'
    },
    {
      title: 'Live Coding Lab & Microservice Architect',
      desc: 'Real-time code reviewer evaluating O(N) complexity alongside prompt-to-project folder & SQL schema generator.',
      icon: Code2,
      color: 'from-amber-500 to-orange-600',
      badge: 'Full Stack'
    },
    {
      title: 'Placement Hub & Mock Interviewer',
      desc: 'Amazon SDE-1 interview simulator evaluating STAR method responses against Amazon Leadership Principles.',
      icon: ShieldCheck,
      color: 'from-rose-500 to-pink-600',
      badge: 'Placement Ready'
    },
    {
      title: 'Vision & Live Voice Mentor',
      desc: 'Upload whiteboard photos or talk naturally via Web Speech API speech-to-text and audio visualizers.',
      icon: Zap,
      color: 'from-indigo-500 to-cyan-500',
      badge: 'Multimodal'
    }
  ];

  const testimonials = [
    {
      name: 'Abi S.',
      role: 'Computer Science Student',
      comment: 'Nexus AI greeted me with my exact exam timeline and auto-arranged my DBMS assignment around my DP revision. Got me into Amazon SDE-1!',
      avatar: '👩‍🎓',
      rating: 5
    },
    {
      name: 'Praveen K.',
      role: 'Full-Stack Developer',
      comment: 'The Live Coding Lab and Prompt-to-Project generator saved me 20+ hours of microservice boilerplate setup. Breathtaking UI!',
      avatar: '👨‍💻',
      rating: 5
    },
    {
      name: 'Sarah M.',
      role: 'Data Structures Aspirant',
      comment: 'The Knowledge Graph made complex 2D Dynamic Programming tabular state transitions crystal clear visually.',
      avatar: '👩‍🔬',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen aurora-gradient-bg text-slate-100 font-sans selection:bg-purple-500 selection:text-white relative overflow-hidden text-left">
      {/* Background Animated Neural Glow Circles */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-tr from-purple-600/25 via-indigo-600/20 to-cyan-400/15 rounded-full blur-[160px] pointer-events-none" />

      {/* Top Navbar */}
      <header className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between relative z-20">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-500 via-indigo-500 to-cyan-400 p-[1px] shadow-lg shadow-purple-500/30">
            <div className="w-full h-full bg-slate-950 rounded-[15px] flex items-center justify-center">
              <Cpu className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <span className="font-heading font-extrabold text-2xl tracking-tight bg-gradient-to-r from-white via-slate-200 to-purple-200 bg-clip-text text-transparent">
            NEXUS AI
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onNavigateToLogin}
            className="px-4 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-cyan-400 text-xs font-bold transition-all cursor-pointer"
          >
            Login
          </button>
          <button
            onClick={onNavigateToSignUp}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
          >
            Sign Up
          </button>
          <button
            onClick={onEnterOS}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:opacity-90 text-white text-xs font-bold transition-all shadow-lg shadow-purple-600/30 flex items-center space-x-2 cursor-pointer"
          >
            <span>Launch Student OS</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Hero Section with 3D Holographic AI Orb */}
      <section className="max-w-7xl mx-auto px-6 pt-10 pb-20 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold font-mono animate-bounce">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>OpenAI Build Week Edition • Neo Glass AI OS</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
            NEXUS AI <br />
            <span className="gradient-text-primary">The AI Operating System for Every Student</span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-2xl leading-relaxed">
            One AI. Every Student. Infinite Possibilities. <br />
            <span className="italic text-purple-200/90 font-medium">
              "Good morning Abi. You have a Java test in 5 days, a DBMS assignment due tomorrow, and you struggle with DP. Here is today's plan."
            </span>
          </p>

          {/* CTA Launch Buttons */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
            <button
              onClick={onEnterOS}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:opacity-90 text-white text-sm font-extrabold tracking-wide transition-all shadow-xl shadow-purple-600/30 flex items-center space-x-3 cursor-pointer"
            >
              <span>Get Started & Enter OS</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={onNavigateToSignUp}
              className="px-7 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-purple-500/40 text-purple-300 text-sm font-bold transition-all shadow-lg flex items-center space-x-2 cursor-pointer"
            >
              <span>Create Account</span>
            </button>
          </div>
        </div>

        {/* Hero Right Column: 3D Holographic AI Orb Showcase */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
          <div className="neo-glass-card p-8 md:p-10 w-full flex flex-col items-center justify-center space-y-6 relative">
            <HolographicOrb size="xl" statusText="NEXUS AI Neural Core Online" />

            <div className="w-full p-4 rounded-2xl bg-slate-950/80 border border-purple-500/20 text-left space-y-2">
              <div className="flex items-center space-x-2 text-xs font-mono font-bold text-cyan-400">
                <Sparkles className="w-4 h-4" />
                <span>AI Operating System Status</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-mono">
                Active Grounding: DBMS Notes • Amazon SDE-1 Roadmap • 2D DP Tabulation • 7 Multi-Agent Orchestration
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20 space-y-12 relative z-10">
        <div className="text-center space-y-3">
          <h2 className="font-heading text-3xl md:text-5xl font-extrabold text-white">
            Engineered for <span className="gradient-text-primary">Peak Academic Excellence</span>
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl mx-auto">
            Everything happens automatically from one interface without switching between disconnected apps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <div
                key={i}
                className="neo-glass-card-interactive p-6 space-y-4 text-left group"
              >
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${feat.color} p-[1px] shadow-lg`}>
                    <div className="w-full h-full bg-slate-950 rounded-[15px] flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                    </div>
                  </div>
                  <span className="text-[10px] uppercase font-mono font-bold px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                    {feat.badge}
                  </span>
                </div>

                <h3 className="font-heading text-lg font-bold text-white">{feat.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-6 py-16 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="font-heading text-2xl md:text-4xl font-bold text-white">Loved by Tech & Engineering Students</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div key={idx} className="neo-glass-card p-6 space-y-4 text-left">
              <div className="flex items-center space-x-1 text-amber-400">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed italic">"{t.comment}"</p>
              <div className="flex items-center space-x-3 pt-2 border-t border-slate-800">
                <span className="text-2xl">{t.avatar}</span>
                <div>
                  <div className="text-xs font-bold text-white">{t.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="neo-glass-card p-10 md:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <h2 className="font-heading text-3xl md:text-5xl font-extrabold text-white">Ready to Transform Your Academic Journey?</h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto">
            Experience NEXUS AI OS in action. Grounded in your notes, assignments, and placement goals.
          </p>
          <button
            onClick={onEnterOS}
            className="px-8 py-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 text-sm font-extrabold transition-all shadow-xl inline-flex items-center space-x-2 cursor-pointer"
          >
            <span>Launch NEXUS AI Workspace Now</span>
            <ArrowRight className="w-4 h-4 text-slate-950" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-8 text-center text-xs text-slate-500 font-mono">
        NEXUS AI • Neo Glass AI Operating System • Built for OpenAI Build Week
      </footer>
    </div>
  );
};
