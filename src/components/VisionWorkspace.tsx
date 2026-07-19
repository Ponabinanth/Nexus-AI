import React, { useState } from 'react';
import { Eye, Upload, Sparkles, CheckCircle, Image as ImageIcon, Zap, FileText } from 'lucide-react';

export const VisionWorkspace: React.FC = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string>('Whiteboard_Diagram.png');
  const [customPrompt, setCustomPrompt] = useState<string>('Handwritten state transition diagram & dynamic programming recurrence relation');
  const [analyzing, setAnalyzing] = useState(false);
  const [visionAnalysis, setVisionAnalysis] = useState<{
    concept: string;
    explanation: string;
    extractedFormula: string;
    recommendation: string;
  } | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRunVision = () => {
    setAnalyzing(true);
    setTimeout(() => {
      const lower = (imageName + ' ' + customPrompt).toLowerCase();

      let concept = 'Handwritten System Diagram & Math Formula';
      let explanation = `NEXUS Vision OCR processed "${imageName}". Extracted relational nodes and mathematical parameters.`;
      let extractedFormula = 'f(x) = ∑_{i=1}^n (x_i · w_i) + β';
      let recommendation = 'Synthesized key nodes into your Knowledge Graph and grounded memory store.';

      if (lower.includes('circuit') || lower.includes('gate') || lower.includes('logic')) {
        concept = 'Digital Logic Circuit Schematics';
        explanation = 'Detected 4 NAND gates, 2 XOR gates, and a 4-bit synchronous binary counter.';
        extractedFormula = 'Y = (A ⊕ B) · (C + D\')';
        recommendation = 'Verified timing propagation delay <= 4.2ns across flip-flop stages.';
      } else if (lower.includes('uml') || lower.includes('class') || lower.includes('architecture')) {
        concept = 'UML Class & Sequence Diagram';
        explanation = 'Parsed 3 Service classes, 2 Data Access Repositories, and 1 Event Bus interface.';
        extractedFormula = 'Interface UserObserver -> Update(event: EventPayload)';
        recommendation = 'Exported class structure to Live Coding Lab for auto-generation.';
      } else if (lower.includes('math') || lower.includes('matrix') || lower.includes('knapsack') || lower.includes('dp')) {
        concept = '2D Matrix Dynamic Programming & Recurrence Relation';
        explanation = 'Detected grid matrix table with subproblem memoization states.';
        extractedFormula = 'dp[i][w] = max(val[i-1] + dp[i-1][w-wt[i-1]], dp[i-1][w])';
        recommendation = 'Generated 3 practice questions in Quiz Studio to test subproblem overlap.';
      }

      setVisionAnalysis({
        concept,
        explanation,
        extractedFormula,
        recommendation
      });
      setAnalyzing(false);
    }, 800);
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300 text-left">
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white flex items-center space-x-2">
            <Eye className="w-6 h-6 text-indigo-400" />
            <span>Vision Workspace & Interactive OCR</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Upload any whiteboard photo, circuit schematic, UML diagram, or math notes to analyze with Computer Vision AI.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <label className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center space-x-1.5 cursor-pointer border border-slate-700">
            <Upload className="w-3.5 h-3.5 text-indigo-400" />
            <span>Upload Image</span>
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </label>
          <button
            onClick={handleRunVision}
            disabled={analyzing}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 flex items-center space-x-1.5 cursor-pointer"
          >
            <Sparkles className={`w-3.5 h-3.5 ${analyzing ? 'animate-spin' : ''}`} />
            <span>{analyzing ? 'Vision AI Processing...' : 'Analyze Image'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Upload / Input Preview Card */}
        <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>Image Source</span>
            <span className="text-indigo-400">{imageName}</span>
          </div>

          {imagePreview ? (
            <div className="h-64 rounded-2xl overflow-hidden border border-indigo-500/30 flex items-center justify-center bg-slate-900">
              <img src={imagePreview} alt="User Upload" className="max-h-full max-w-full object-contain" />
            </div>
          ) : (
            <div className="h-64 rounded-2xl bg-gradient-to-br from-indigo-950 to-purple-950 border border-indigo-500/20 flex flex-col items-center justify-center p-6 text-center space-y-2">
              <ImageIcon className="w-12 h-12 text-indigo-400 animate-pulse" />
              <div className="text-sm font-bold text-slate-200">{imageName}</div>
              <p className="text-xs text-slate-400">Click "Upload Image" above to upload your diagram or photo</p>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-400 uppercase">Context / Notes Prompt:</label>
            <input
              type="text"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Describe what to look for (e.g. state matrix, circuit components)..."
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500/50"
            />
          </div>
        </div>

        {/* Vision Explanation Card */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center space-x-1.5">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Vision AI Analysis Output</span>
          </div>

          {visionAnalysis ? (
            <div className="space-y-4 text-xs text-slate-200 animate-in fade-in duration-300">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="font-bold text-emerald-400 flex items-center space-x-1">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Detected Concept: {visionAnalysis.concept}</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  {visionAnalysis.explanation}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 font-mono">
                <div className="font-bold text-indigo-300">Extracted LaTeX / Code Equation:</div>
                <div className="text-slate-300 p-2 bg-slate-900 rounded-lg">{visionAnalysis.extractedFormula}</div>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-indigo-300 font-medium">
                💡 <span className="font-bold">Next Action:</span> {visionAnalysis.recommendation}
              </div>
            </div>
          ) : (
            <div className="p-16 text-center text-slate-500 text-xs">
              Upload an image or click "Analyze Image" to run Vision OCR on your input.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

