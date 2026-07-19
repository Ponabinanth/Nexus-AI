import React, { useState } from 'react';
import { 
  Code2, 
  Play, 
  Sparkles, 
  Layers, 
  CheckCircle, 
  Bug, 
  FolderTree, 
  Database, 
  Globe, 
  Zap,
  Copy,
  Check
} from 'lucide-react';
import { ProjectBlueprint } from '../types';
import { generateProjectBlueprint } from '../services/aiEngine';

export const CodingLab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'editor' | 'generator'>('editor');
  const [language, setLanguage] = useState<'java' | 'python' | 'cpp'>('java');
  const [code, setCode] = useState('');
  const [reviewResult, setReviewResult] = useState<{
    bugs: string[];
    complexity: string;
    suggestions: string[];
  } | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  // Project Generator state
  const [projectPrompt, setProjectPrompt] = useState('');
  const [generatingProject, setGeneratingProject] = useState(false);
  const [blueprint, setBlueprint] = useState<ProjectBlueprint | null>(null);

  const handleRunCodeReview = () => {
    setAnalyzing(true);
    setTimeout(() => {
      const codeLines = code.split('\n').length;
      const lowerCode = code.toLowerCase();

      // Estimate complexity by analyzing loops
      const forLoopCount = (lowerCode.match(/\bfor\b/g) || []).length;
      const whileLoopCount = (lowerCode.match(/\bwhile\b/g) || []).length;
      const totalLoops = forLoopCount + whileLoopCount;

      let complexityStr = 'Time: O(1) | Space: O(1)';
      if (totalLoops === 1) {
        complexityStr = 'Time: O(N) | Space: O(1)';
      } else if (totalLoops >= 2) {
        complexityStr = `Time: O(N^${totalLoops}) | Space: O(N)`;
      }

      // Detect potential bugs / edge cases
      const detectedBugs: string[] = [];
      if (!lowerCode.includes('null') && !lowerCode.includes('undefined') && !lowerCode.includes('optional') && !lowerCode.includes('if')) {
        detectedBugs.push('No null pointer or boundary condition check detected.');
      }
      if (lowerCode.includes('[]') || lowerCode.includes('list') || lowerCode.includes('array')) {
        if (!lowerCode.includes('.length') && !lowerCode.includes('.size') && !lowerCode.includes('len(')) {
          detectedBugs.push('Array length validation missing before indexing (risk of OutOfBoundsException).');
        }
      }
      if (lowerCode.includes('stream') || lowerCode.includes('reader') || lowerCode.includes('connection')) {
        if (!lowerCode.includes('close') && !lowerCode.includes('try-with-resources') && !lowerCode.includes('finally')) {
          detectedBugs.push('Unclosed resource handle detected. Ensure resource cleanup in try-with-resources.');
        }
      }
      if (detectedBugs.length === 0) {
        detectedBugs.push(`Validated ${codeLines} lines. Ensure zero/negative input parameters are safely guarded.`);
      }

      // Detect suggestions
      const suggestions: string[] = [
        `Analysis of ${language.toUpperCase()} code (${codeLines} lines): Consider adding comprehensive unit test cases.`
      ];
      if (forLoopCount >= 2) {
        suggestions.push('Nested loop detected. Evaluate HashMap or Memoization to reduce quadratic time complexity.');
      }
      if (language === 'java' && !lowerCode.includes('@override')) {
        suggestions.push('Add modern Java 21 record classes or functional interfaces for immutable DTO handling.');
      }

      setReviewResult({
        bugs: detectedBugs,
        complexity: complexityStr,
        suggestions
      });
      setAnalyzing(false);
    }, 600);
  };

  const handleGenerateProject = () => {
    setGeneratingProject(true);
    setTimeout(() => {
      const bp = generateProjectBlueprint(projectPrompt);
      setBlueprint(bp);
      setGeneratingProject(false);
    }, 1000);
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300 text-left">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/80 border border-slate-800">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white flex items-center space-x-2">
            <Code2 className="w-6 h-6 text-emerald-400" />
            <span>Live Coding Lab & AI Project Generator</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Write code with real-time AI reviewer or generate full-stack microservice blueprints in seconds.
          </p>
        </div>

        <div className="flex p-1 bg-slate-950 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveTab('editor')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'editor' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Live Code Reviewer
          </button>
          <button
            onClick={() => setActiveTab('generator')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'generator' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            AI Project Generator
          </button>
        </div>
      </div>

      {activeTab === 'editor' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Code Editor */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between px-2">
              <div className="flex space-x-2">
                {(['java', 'python', 'cpp'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition-all ${
                      language === lang ? 'bg-slate-800 text-emerald-400 border border-slate-700' : 'text-slate-500'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>

              <button
                onClick={handleRunCodeReview}
                disabled={analyzing}
                className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20 flex items-center space-x-1.5 cursor-pointer"
              >
                <Sparkles className={`w-3.5 h-3.5 ${analyzing ? 'animate-spin' : ''}`} />
                <span>{analyzing ? 'AI Analyzing Code...' : 'Analyze & Review Code'}</span>
              </button>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-950 overflow-hidden font-mono text-xs shadow-2xl">
              <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 text-slate-400 text-[11px] flex justify-between">
                <span>main.{language === 'cpp' ? 'cpp' : language === 'python' ? 'py' : 'java'}</span>
                <span className="text-emerald-400">{language === 'java' ? 'Java 21 Engine' : language === 'python' ? 'Python 3.12 Runtime' : 'C++17 Compiler'}</span>
              </div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                rows={16}
                placeholder={language === 'java' ? '// Paste your Java code here to run AI static analysis...\n// Example: public class Solution { ... }' : language === 'python' ? '# Paste your Python code here to run AI static analysis...\n# Example: def solve(n): ...' : '// Paste your C++ code here to run AI static analysis...\n// Example: int main() { ... }'}
                className="w-full p-4 bg-transparent text-slate-100 placeholder-slate-600 focus:outline-none leading-relaxed font-mono resize-none"
              />
            </div>
          </div>

          {/* AI Reviewer Sidebar Output */}
          <div className="lg:col-span-1 space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
              AI Code Diagnostics
            </div>

            {reviewResult ? (
              <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 text-xs animate-in fade-in duration-300">
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono font-bold">
                  {reviewResult.complexity}
                </div>

                <div className="space-y-2">
                  <div className="font-bold text-amber-400 flex items-center space-x-1">
                    <Bug className="w-4 h-4" />
                    <span>Potential Edge Cases</span>
                  </div>
                  <ul className="space-y-1 text-slate-300">
                    {reviewResult.bugs.map((bug, i) => (
                      <li key={i} className="p-2 rounded bg-slate-950 border border-slate-800">• {bug}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <div className="font-bold text-indigo-400 flex items-center space-x-1">
                    <Zap className="w-4 h-4" />
                    <span>AI Optimization Suggestions</span>
                  </div>
                  <ul className="space-y-1 text-slate-300">
                    {reviewResult.suggestions.map((sug, i) => (
                      <li key={i} className="p-2 rounded bg-slate-950 border border-slate-800">• {sug}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="p-12 rounded-3xl bg-slate-900/40 border border-slate-800 text-center text-slate-500 text-xs">
                Click "Analyze & Review Code" to run AI static analysis.
              </div>
            )}
          </div>
        </div>
      ) : (
        /* AI Project Architecture Generator */
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-indigo-950/60 border border-emerald-500/30 space-y-4">
            <h2 className="text-lg font-bold text-white">Prompt-to-Project Blueprint Generator</h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={projectPrompt}
                onChange={(e) => setProjectPrompt(e.target.value)}
                placeholder="Describe your project idea (e.g. Real-time chat app with Java Spring Boot and WebSocket)..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
              />
              <button
                onClick={handleGenerateProject}
                disabled={generatingProject}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/30 flex items-center justify-center space-x-2 shrink-0"
              >
                <Layers className={`w-4 h-4 ${generatingProject ? 'animate-spin' : ''}`} />
                <span>{generatingProject ? 'Generating Blueprint...' : 'Generate Project'}</span>
              </button>
            </div>
          </div>

          {blueprint && (
            <div className="p-6 md:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6 animate-in fade-in duration-300">
              <div>
                <h3 className="text-xl font-bold text-white">{blueprint.title}</h3>
                <p className="text-xs text-slate-400 mt-1">{blueprint.tagline}</p>
              </div>

              {/* Tech stack badges */}
              <div className="flex flex-wrap gap-2">
                {blueprint.techStack.map((tech, i) => (
                  <span key={i} className="px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                    {tech}
                  </span>
                ))}
              </div>

              {/* Folder Structure & DB Schemas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center space-x-1">
                    <FolderTree className="w-4 h-4" />
                    <span>Folder Structure</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 space-y-1">
                    {blueprint.folderStructure.map((f, i) => (
                      <div key={i}>📁 {f}</div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-1">
                    <Database className="w-4 h-4" />
                    <span>Database DDL Schema</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 space-y-1">
                    {blueprint.dbSchema.map((db, i) => (
                      <div key={i}>{db}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
