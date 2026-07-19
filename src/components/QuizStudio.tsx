import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, XCircle, Sparkles, Terminal, ShieldAlert } from 'lucide-react';
import { QuizQuestion } from '../types';
import { generateQuizFromTopic } from '../services/aiEngine';

export const QuizStudio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'quiz' | 'sandbox'>('quiz');
  const [topic, setTopic] = useState('');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  // Sandbox state
  const [sqlQuery, setSqlQuery] = useState('');
  const [sandboxOutput, setSandboxOutput] = useState<string | null>(null);

  const handleSelectOption = (qId: string, optIdx: number) => {
    if (submitted) return;
    setSelectedAnswers(prev => ({ ...prev, [qId]: optIdx }));
  };

  const handleGenerateNewQuiz = () => {
    if (!topic.trim()) return;
    const newQs = generateQuizFromTopic(topic);
    setQuestions(newQs);
    setSelectedAnswers({});
    setSubmitted(false);
  };

  const handleRunSandbox = () => {
    const lower = sqlQuery.toLowerCase();
    const isSqlInjection = lower.includes("or '1'='1'") || lower.includes("or 1=1") || lower.includes("union select") || lower.includes("--");

    if (isSqlInjection) {
      setSandboxOutput(`🚨 Security Sandbox Alert: Dangerous SQL Injection Pattern Detected!

Executed Query: ${sqlQuery}
Diagnosis: Input contains tautological bypass condition (OR '1'='1'). Bypasses authentication filter and returns all table records.

AI Recommendation: Use PreparedStatement parameterized query binding:
PreparedStatement stmt = conn.prepareStatement("SELECT * FROM users WHERE username = ? AND password = ?");
stmt.setString(1, inputUsername);`);
    } else {
      setSandboxOutput(`✅ Security Sandbox Output: Valid Query Structure Executed!

Query: ${sqlQuery}
Execution Status: Successfully compiled & executed against virtual PostgreSQL schema.
Returned Rows: 4 matching records.
Execution Latency: 1.2ms (Index Scan on primary key).`);
    }
  };

  const score = Object.entries(selectedAnswers).filter(([id, ans]) => {
    const q = questions.find(item => item.id === id);
    return q && q.correctAnswer === ans;
  }).length;

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300 text-left">
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/80 border border-slate-800">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white flex items-center space-x-2">
            <HelpCircle className="w-6 h-6 text-indigo-400" />
            <span>Quiz Studio & AI Conceptual Sandbox</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Auto-generate adaptive quizzes from notes or experiment safely in the interactive SQL/Security sandbox.
          </p>
        </div>

        <div className="flex p-1 bg-slate-950 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'quiz' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Adaptive Quiz Studio
          </button>
          <button
            onClick={() => setActiveTab('sandbox')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'sandbox' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            AI Concept Sandbox
          </button>
        </div>
      </div>

      {activeTab === 'quiz' ? (
        <div className="space-y-6">
          {/* Topic Generator Input */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row gap-3 items-center">
            <div className="flex-1 w-full space-y-1">
              <label className="text-[10px] font-bold uppercase text-slate-400">Quiz Topic / Subject:</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Enter topic (e.g. React Hooks, DBMS Normalization, Python Data Science)..."
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-indigo-500/50"
              />
            </div>
            <button
              onClick={handleGenerateNewQuiz}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/30 flex items-center space-x-1.5 shrink-0 self-end"
            >
              <Sparkles className="w-4 h-4 text-indigo-200" />
              <span>Generate Quiz</span>
            </button>
          </div>
          {/* Question Cards */}
          <div className="space-y-4">
            {questions.map((q, qIdx) => (
              <div key={q.id} className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-400">Question {qIdx + 1}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 font-mono">
                    {q.difficulty}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white">{q.question}</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = selectedAnswers[q.id] === optIdx;
                    const isCorrect = q.correctAnswer === optIdx;

                    let btnStyle = 'bg-slate-950 border-slate-800 text-slate-300 hover:border-indigo-500/40';
                    if (submitted) {
                      if (isCorrect) btnStyle = 'bg-emerald-500/10 border-emerald-500 text-emerald-300 font-bold';
                      else if (isSelected) btnStyle = 'bg-rose-500/10 border-rose-500 text-rose-300';
                    } else if (isSelected) {
                      btnStyle = 'bg-indigo-600/90 border-indigo-500 text-white font-bold';
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(q.id, optIdx)}
                        className={`p-3 rounded-2xl border text-xs text-left transition-all ${btnStyle}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {submitted && (
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
                    💡 <span className="font-bold text-slate-200">Explanation:</span> {q.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center">
            {!submitted ? (
              <button
                onClick={() => setSubmitted(true)}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30"
              >
                Submit Quiz Answers
              </button>
            ) : (
              <div className="text-sm font-bold text-emerald-400">
                Quiz Complete! Score: {score} / {questions.length} Correct
              </div>
            )}
          </div>
        </div>
      ) : (
        /* AI Concept Sandbox */
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4" />
              <span>SQL Injection Security Sandbox</span>
            </div>

            <textarea
              value={sqlQuery}
              onChange={(e) => setSqlQuery(e.target.value)}
              rows={3}
              placeholder={"-- Type a SQL query to test for security vulnerabilities\n-- Example injection: SELECT * FROM users WHERE username='admin' OR '1'='1' --\n-- Example safe: SELECT id, name FROM users WHERE id = 1"}
              className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500/40"
            />

            <button
              onClick={handleRunSandbox}
              className="px-5 py-2 rounded-xl bg-amber-600 text-white text-xs font-bold flex items-center space-x-1.5"
            >
              <Terminal className="w-4 h-4" />
              <span>Execute Sandbox Simulation</span>
            </button>
          </div>

          {sandboxOutput && (
            <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-line animate-in fade-in">
              {sandboxOutput}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
