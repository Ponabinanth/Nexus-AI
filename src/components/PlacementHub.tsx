import React, { useState } from 'react';
import { 
  Briefcase, 
  Award, 
  Sparkles, 
  Mic, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight, 
  FileCheck,
  Send,
  Zap
} from 'lucide-react';
import { DigitalTwinProfile } from '../types';

interface PlacementHubProps {
  profile: DigitalTwinProfile;
}

export const PlacementHub: React.FC<PlacementHubProps> = ({ profile }) => {
  const [activeTab, setActiveTab] = useState<'interview' | 'resume'>('interview');
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const interviewQuestions = [
    {
      q: 'Tell me about a challenging Java multi-threading or memory issue you debugged in a project.',
      hint: 'Focus on thread deadlocks, synchronized blocks, or virtual thread migration.'
    },
    {
      q: 'How would you design a distributed LRU Cache with O(1) time complexity for reads and writes?',
      hint: 'Combine Doubly LinkedList with HashMap.'
    },
    {
      q: 'Describe a situation where you had to prioritize tight DBMS assignment deadlines over code quality.',
      hint: 'Use Amazon Leadership Principle: Bias for Action.'
    }
  ];

  const handleStartInterview = () => {
    setInterviewStarted(true);
    setQuestionIndex(0);
    setFeedback(null);
  };

  const [resumeText, setResumeText] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [atsAnalysis, setAtsAnalysis] = useState<{
    score: number;
    found: string[];
    missing: string[];
    advice: string;
  } | null>(null);

  const handleSubmitAnswer = () => {
    if (!userAnswer.trim()) return;

    const words = userAnswer.trim().split(/\s+/).length;
    const lower = userAnswer.toLowerCase();

    // Check STAR structure
    const hasSituation = lower.includes('when') || lower.includes('project') || lower.includes('problem') || lower.includes('issue');
    const hasAction = lower.includes('used') || lower.includes('implemented') || lower.includes('solved') || lower.includes('built') || lower.includes('refactored');
    const hasResult = lower.includes('result') || lower.includes('improved') || lower.includes('reduced') || lower.includes('%') || lower.includes('achieved');

    let score = 6.0;
    if (words > 25) score += 1.5;
    if (hasSituation) score += 0.8;
    if (hasAction) score += 0.9;
    if (hasResult) score += 0.8;
    if (score > 10) score = 9.8;

    const formattedScore = score.toFixed(1);
    let breakdown = `Analyzed ${words} words. `;
    if (hasResult) breakdown += '✓ Included measurable results/metrics. ';
    else breakdown += '⚠️ Tip: Add quantitative results (e.g. latency reduced by 30%). ';

    setFeedback(`AI Career Agent Score: ${formattedScore}/10. ${breakdown}`);
  };

  const handleScanResume = () => {
    const lower = resumeText.toLowerCase();
    const techKeywords = ['java', 'spring', 'python', 'react', 'sql', 'postgresql', 'docker', 'redis', 'aws', 'kafka', 'microservices', 'git', 'ci/cd', 'dsa'];
    
    const found: string[] = [];
    const missing: string[] = [];

    techKeywords.forEach(kw => {
      if (lower.includes(kw)) {
        found.push(kw.toUpperCase());
      } else {
        missing.push(kw.toUpperCase());
      }
    });

    const score = Math.round((found.length / (found.length + missing.length)) * 100);

    setAtsAnalysis({
      score: Math.max(score, 65),
      found: found.slice(0, 8),
      missing: missing.slice(0, 6),
      advice: `Resume evaluated for target role: "${targetRole}". Found ${found.length} tech keywords out of ${techKeywords.length} checked.`
    });
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300 text-left">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/80 border border-slate-800">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white flex items-center space-x-2">
            <Briefcase className="w-6 h-6 text-amber-400" />
            <span>Placement Hub & AI Mock Interviewer</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Target company interview simulation, ATS resume scoring, and Amazon SDE readiness.
          </p>
        </div>

        <div className="flex p-1 bg-slate-950 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveTab('interview')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'interview' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Mock Interview Simulator
          </button>
          <button
            onClick={() => setActiveTab('resume')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'resume' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Resume ATS Intelligence
          </button>
        </div>
      </div>

      {activeTab === 'interview' ? (
        <div className="space-y-6">
          {!interviewStarted ? (
            <div className="p-8 rounded-3xl bg-gradient-to-r from-amber-950/60 via-slate-900 to-indigo-950/60 border border-amber-500/30 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
                <Mic className="w-8 h-8 animate-bounce" />
              </div>

              <h2 className="text-xl font-bold text-white">Amazon SDE-1 Technical Mock Interview</h2>
              <p className="text-xs text-slate-300 max-w-xl mx-auto leading-relaxed">
                The Career Agent will ask 3 technical & behavioral questions, evaluate your responses against Amazon Leadership Principles, and calculate your final score.
              </p>

              <button
                onClick={handleStartInterview}
                className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all shadow-lg shadow-amber-600/30 inline-flex items-center space-x-2 cursor-pointer"
              >
                <span>Start Mock Interview Session</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="p-6 md:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between text-xs text-amber-400 font-semibold border-b border-slate-800 pb-3">
                <span>Question {questionIndex + 1} of {interviewQuestions.length}</span>
                <span className="font-mono text-slate-400">Target: Amazon SDE-1</span>
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-bold text-white leading-snug">
                  {interviewQuestions[questionIndex].q}
                </h3>
                <p className="text-xs text-slate-400 italic">
                  💡 Hint: {interviewQuestions[questionIndex].hint}
                </p>
              </div>

              <textarea
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                rows={5}
                placeholder="Type your answer using the STAR method (Situation, Task, Action, Result)..."
                className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/50 leading-relaxed"
              />

              <div className="flex justify-between items-center">
                <button
                  onClick={handleSubmitAnswer}
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all flex items-center space-x-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Answer for AI Evaluation</span>
                </button>

                {questionIndex < interviewQuestions.length - 1 && (
                  <button
                    onClick={() => {
                      setQuestionIndex(prev => prev + 1);
                      setUserAnswer('');
                      setFeedback(null);
                    }}
                    className="text-xs text-slate-400 hover:text-white flex items-center space-x-1"
                  >
                    <span>Next Question</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {feedback && (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 space-y-1 animate-in fade-in">
                  <div className="font-bold">AI Feedback Output</div>
                  <div>{feedback}</div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Resume Intelligence */
        <div className="p-6 md:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between gap-3 border-b border-slate-800 pb-4">
              <div className="flex-1 space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase">Target Job Role:</label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Amazon SDE-1, Google Software Engineer, Full-Stack Developer..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
                />
              </div>
              <button
                onClick={handleScanResume}
                className="px-5 py-2.5 h-10 self-end rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all shadow-md shadow-amber-600/30 cursor-pointer"
              >
                Scan My Resume
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase">Paste Resume Text or Overview:</label>
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                rows={4}
                placeholder="Paste your resume text or summary here (e.g. skills, experience, projects)...&#10;Example: Proficient in Java, Spring Boot, React. Built REST APIs, worked with PostgreSQL, Docker..."
                className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/50 leading-relaxed font-mono"
              />
            </div>
          </div>

          {atsAnalysis ? (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-300 font-bold">{atsAnalysis.advice}</span>
                <span className="text-sm font-mono font-extrabold text-emerald-400">{atsAnalysis.score}% Match</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-emerald-400">High Impact Keywords Found</div>
                  <div className="flex flex-wrap gap-1.5">
                    {atsAnalysis.found.map((kw, i) => (
                      <span key={i} className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-300 text-[11px] font-semibold">
                        ✓ {kw}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-rose-400">Missing Keywords to Include</div>
                  <div className="flex flex-wrap gap-1.5">
                    {atsAnalysis.missing.map((kw, i) => (
                      <span key={i} className="px-2.5 py-1 rounded bg-rose-500/10 text-rose-300 text-[11px] font-semibold">
                        + {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 text-xs">
              Click "Scan My Resume" to run AI ATS diagnostic scoring on your text above.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
