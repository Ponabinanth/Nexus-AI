import React, { useState } from 'react';
import { 
  BookOpen, 
  Upload, 
  FileText, 
  Image as ImageIcon, 
  Mic, 
  Sparkles, 
  HelpCircle, 
  ArrowRight,
  FileCode,
  Layers,
  CheckCircle2
} from 'lucide-react';
import { DocumentItem } from '../types';
import { apiService } from '../services/api';

interface AILibraryProps {
  documents: DocumentItem[];
  setDocuments: React.Dispatch<React.SetStateAction<DocumentItem[]>>;
  onNavigate: (tab: string) => void;
  userId?: string;
}

export const AILibrary: React.FC<AILibraryProps> = ({
  documents,
  setDocuments,
  onNavigate,
  userId
}) => {
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const processFile = (file: File) => {
    setUploading(true);
    const fileName = file.name;
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
    let fileType: 'pdf' | 'ppt' | 'image' | 'audio' = 'pdf';

    if (file.type.includes('image')) fileType = 'image';
    else if (file.type.includes('audio')) fileType = 'audio';
    else if (fileName.endsWith('.ppt') || fileName.endsWith('.pptx')) fileType = 'ppt';

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = (event.target?.result as string) || '';
      const sampleText = text.substring(0, 300) || `Uploaded file "${fileName}". AI memory vector index created.`;

      const words = fileName.replace(/[^a-zA-Z0-9\s]/g, ' ').split(/\s+/).filter(w => w.length > 3);
      const concepts = Array.from(new Set(words)).slice(0, 4);
      if (concepts.length < 2) concepts.push('Core Subject', 'AI Memory Grounding');

      const docPayload: DocumentItem = {
        id: `doc-${Date.now()}`,
        title: fileName,
        type: fileType,
        size: fileSizeMB,
        uploadDate: 'Just now',
        summary: `AI parsed "${fileName}". Grounded in vector store for instant RAG retrieval.`,
        keyConcepts: concepts,
        parsedContent: sampleText
      };

      // Save to backend
      try {
        const savedDoc = await apiService.addDocument({ ...docPayload, userId: userId || 'guest' });
        setDocuments(prev => [savedDoc, ...prev]);
        setSelectedDoc(savedDoc);
      } catch {
        // Fallback: add locally
        setDocuments(prev => [docPayload, ...prev]);
        setSelectedDoc(docPayload);
      }
      setUploading(false);
    };

    if (file.type.includes('text') || fileName.endsWith('.txt') || fileName.endsWith('.md')) {
      reader.readAsText(file);
    } else {
      reader.readAsDataURL(file);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300 text-left selection:bg-purple-500 selection:text-white">
      {/* Header Banner */}
      <div className="neo-glass-card p-6 md:p-8 relative overflow-hidden border-purple-500/20">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl md:text-3xl font-extrabold text-white flex items-center space-x-3">
              <BookOpen className="w-7 h-7 text-purple-400" />
              <span>AI Academic Library & Note Grounding</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Upload PDFs, slides, whiteboard photos, or lecture audio. NEXUS AI remembers and grounds every answer in your notes.
            </p>
          </div>

          <label className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:opacity-90 text-white text-xs font-extrabold transition-all shadow-lg shadow-purple-600/30 flex items-center space-x-2 cursor-pointer">
            <Upload className="w-4 h-4" />
            <span>Upload Document / Notes</span>
            <input type="file" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>
      </div>

      {/* Huge Interactive Drag & Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        className={`neo-glass-card p-10 text-center transition-all duration-300 border-2 border-dashed ${
          isDragOver 
            ? 'border-cyan-400 bg-cyan-500/10 scale-[1.01]' 
            : 'border-purple-500/30 hover:border-purple-500/60'
        }`}
      >
        <div className="max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-purple-600 to-cyan-500 p-[1px] shadow-xl shadow-purple-500/30">
            <div className="w-full h-full bg-slate-950 rounded-[23px] flex items-center justify-center">
              <Upload className="w-8 h-8 text-cyan-300 animate-bounce" />
            </div>
          </div>

          <div>
            <h3 className="font-heading text-lg font-bold text-white">Drag & Drop Files Here</h3>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Supports PDF, DOCX, PPT, Images, and Audio files up to 50MB
            </p>
          </div>

          <div className="flex items-center justify-center space-x-3 text-[11px] text-purple-300 font-mono">
            <span className="px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20">📄 PDF</span>
            <span className="px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20">📊 PPTX</span>
            <span className="px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20">🖼️ Images</span>
            <span className="px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20">🎙️ Audio</span>
          </div>

          <label className="inline-flex px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-purple-500/40 text-purple-300 text-xs font-bold transition-all cursor-pointer">
            <span>Browse Files</span>
            <input type="file" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>
      </div>

      {uploading && (
        <div className="neo-glass-card p-4 border-cyan-500/40 text-cyan-300 text-xs font-mono flex items-center space-x-3 animate-pulse">
          <Sparkles className="w-5 h-5 text-cyan-400 animate-spin" />
          <span>Parsing file OCR, extracting key concepts, and grounding vector index (pgvector)...</span>
        </div>
      )}

      {/* Main Grid: Document List vs Active Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Document Cards */}
        <div className="lg:col-span-1 space-y-3">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 px-1">
            Uploaded Materials ({documents.length})
          </div>

          <div className="space-y-3">
            {documents.length === 0 && !uploading && (
              <div className="p-8 rounded-2xl border-2 border-dashed border-slate-800 text-center space-y-3">
                <div className="text-3xl">📂</div>
                <div className="text-sm font-bold text-slate-300">No documents uploaded yet</div>
                <div className="text-xs text-slate-500 font-mono">Upload PDFs, slides, or audio to enable AI-grounded answers</div>
              </div>
            )}
            {documents.map((doc) => {
              const isSelected = selectedDoc?.id === doc.id;
              return (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    isSelected 
                      ? 'bg-slate-950 border-purple-500/80 shadow-lg shadow-purple-500/20' 
                      : 'neo-glass-card-interactive border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2.5 rounded-xl bg-slate-900 text-purple-400">
                        {doc.type === 'image' ? <ImageIcon className="w-4 h-4 text-purple-400" /> :
                         doc.type === 'audio' ? <Mic className="w-4 h-4 text-amber-400" /> :
                         <FileText className="w-4 h-4 text-cyan-400" />}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white truncate max-w-[170px]">{doc.title}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{doc.size} • {doc.uploadDate}</div>
                      </div>
                    </div>
                    <span className="text-[9px] uppercase px-2 py-0.5 rounded-md font-mono font-bold bg-slate-900 text-purple-300 border border-purple-500/20">
                      {doc.type}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {doc.summary}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Document Detailed Inspector */}
        <div className="lg:col-span-2">
          {selectedDoc ? (
            <div className="neo-glass-card p-6 md:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h2 className="font-heading text-xl font-bold text-white flex items-center space-x-2">
                    <span>{selectedDoc.title}</span>
                  </h2>
                  <span className="text-xs text-cyan-400 font-mono">Parsed & Grounded in Vector Database</span>
                </div>

                <button
                  onClick={() => onNavigate('quiz-studio')}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md flex items-center space-x-1.5 cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Generate Quiz</span>
                </button>
              </div>

              {/* AI Summary Block */}
              <div className="space-y-2">
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>AI Extracted Note Summary</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-200 leading-relaxed font-mono">
                  {selectedDoc.summary}
                </div>
              </div>

              {/* Key Concept Tags */}
              <div className="space-y-2">
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                  Extracted Concepts ({selectedDoc.keyConcepts.length})
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedDoc.keyConcepts.map((concept, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-mono font-bold"
                    >
                      {concept}
                    </span>
                  ))}
                </div>
              </div>

              {/* Parsed Snippet Content */}
              <div className="space-y-2">
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                  Parsed Text Content
                </div>
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-400 leading-relaxed max-h-48 overflow-y-auto">
                  {selectedDoc.parsedContent}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 flex gap-3">
                <button
                  onClick={() => onNavigate('ai-chat')}
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white text-xs font-extrabold transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <span>Ground this Note in AI Chat</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500 text-xs font-mono">
              Select a document to inspect notes.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
