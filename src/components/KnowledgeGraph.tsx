import React, { useState, useEffect, useRef } from 'react';
import { GitFork, Award, Zap, Sparkles, CheckCircle, Lock, BookOpen } from 'lucide-react';
import { KnowledgeNode } from '../types';

interface KnowledgeGraphProps {
  nodes: KnowledgeNode[];
}

export const KnowledgeGraph: React.FC<KnowledgeGraphProps> = ({ nodes }) => {
  const [activeTab, setActiveTab] = useState<'graph' | 'skill-tree'>('graph');
  const [selectedNode, setSelectedNode] = useState<KnowledgeNode | null>(nodes[0] || null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (activeTab !== 'graph' || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let angle = 0;

    // Layout positions around canvas center
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    const nodePositions: Record<string, { x: number; y: number }> = {};
    nodes.forEach((node, index) => {
      const radius = 140 + (index % 3) * 60;
      const nodeAngle = (index / nodes.length) * Math.PI * 2;
      nodePositions[node.id] = {
        x: centerX + Math.cos(nodeAngle) * radius,
        y: centerY + Math.sin(nodeAngle) * radius
      };
    });

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      angle += 0.005;

      // Draw Connection Lines
      nodes.forEach((node) => {
        const sourcePos = nodePositions[node.id];
        if (!sourcePos) return;

        node.connections.forEach((targetId) => {
          const targetPos = nodePositions[targetId];
          if (targetPos) {
            ctx.beginPath();
            ctx.moveTo(sourcePos.x, sourcePos.y);
            ctx.lineTo(targetPos.x, targetPos.y);
            ctx.strokeStyle = selectedNode?.id === node.id || selectedNode?.id === targetId
              ? 'rgba(99, 102, 241, 0.7)' 
              : 'rgba(255, 255, 255, 0.08)';
            ctx.lineWidth = selectedNode?.id === node.id ? 2 : 1;
            ctx.stroke();
          }
        });
      });

      // Draw Nodes
      nodes.forEach((node) => {
        const pos = nodePositions[node.id];
        if (!pos) return;

        const isSelected = selectedNode?.id === node.id;
        const isMastered = node.mastery >= 80;

        // Glow ring
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, isSelected ? 22 : 16, 0, Math.PI * 2);
        ctx.fillStyle = isMastered 
          ? (isSelected ? 'rgba(16, 185, 129, 0.4)' : 'rgba(16, 185, 129, 0.2)') 
          : (isSelected ? 'rgba(99, 102, 241, 0.4)' : 'rgba(99, 102, 241, 0.15)');
        ctx.fill();

        // Node circle
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, isSelected ? 14 : 10, 0, Math.PI * 2);
        ctx.fillStyle = isMastered ? '#10b981' : isSelected ? '#6366f1' : '#334155';
        ctx.fill();

        // Label
        ctx.fillStyle = isSelected ? '#ffffff' : '#94a3b8';
        ctx.font = isSelected ? 'bold 11px sans-serif' : '10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(node.label, pos.x, pos.y + 26);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [activeTab, nodes, selectedNode]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    nodes.forEach((node, index) => {
      const radius = 140 + (index % 3) * 60;
      const nodeAngle = (index / nodes.length) * Math.PI * 2;
      const posX = centerX + Math.cos(nodeAngle) * radius;
      const posY = centerY + Math.sin(nodeAngle) * radius;

      const dist = Math.hypot(clickX - posX, clickY - posY);
      if (dist < 25) {
        setSelectedNode(node);
      }
    });
  };

  const skillTreeCategories = [
    { title: 'Level 1: Core Fundamentals', xp: '1,200 XP', unlocked: true, items: ['Java 21 Syntax', 'Object-Oriented Design', 'SQL Basics'] },
    { title: 'Level 2: Data Structures & DBMS', xp: '2,800 XP', unlocked: true, items: ['Collections & Generics', 'Normalization 3NF', 'Trees & Graphs'] },
    { title: 'Level 3: Advanced Optimization', xp: '4,500 XP', unlocked: false, items: ['2D Dynamic Programming', 'Spring Boot Microservices', 'System Design'] }
  ];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300 text-left">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/80 border border-slate-800">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white flex items-center space-x-2">
            <GitFork className="w-6 h-6 text-purple-400" />
            <span>Interactive Knowledge Graph & Skill Tree</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Visual concept map linking all uploaded notes, algorithms, and DBMS topics into connected nodes.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex p-1 bg-slate-950 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveTab('graph')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'graph' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Canvas Graph View
          </button>
          <button
            onClick={() => setActiveTab('skill-tree')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'skill-tree' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Gamified Skill Tree
          </button>
        </div>
      </div>

      {activeTab === 'graph' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Interactive Canvas Graph */}
          <div className="lg:col-span-2 rounded-3xl bg-slate-950 border border-slate-800 p-4 relative overflow-hidden flex items-center justify-center min-h-[460px]">
            <div className="absolute top-4 left-4 flex items-center space-x-2 text-xs text-slate-400 z-10">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              <span>Mastered (80%+)</span>
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 pl-3"></span>
              <span>In Progress</span>
            </div>

            <canvas
              ref={canvasRef}
              width={650}
              height={440}
              onClick={handleCanvasClick}
              className="cursor-pointer max-w-full"
            />
          </div>

          {/* Node Detail Card */}
          <div className="lg:col-span-1">
            {selectedNode ? (
              <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    {selectedNode.category}
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-400">{selectedNode.mastery}% Mastery</span>
                </div>

                <h3 className="text-lg font-bold text-white">{selectedNode.label}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{selectedNode.description}</p>

                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-400">Connected Child Concepts:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedNode.connections.map((connId, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium">
                        {connId}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-slate-500 text-xs">
                Click any node on the graph to inspect mastery.
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Gamified Skill Tree View */
        <div className="space-y-6">
          {skillTreeCategories.map((lvl, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-3xl border transition-all ${
                lvl.unlocked ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-950/40 border-slate-900 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {lvl.unlocked ? (
                    <Award className="w-6 h-6 text-amber-400" />
                  ) : (
                    <Lock className="w-6 h-6 text-slate-600" />
                  )}
                  <div>
                    <h3 className="text-base font-bold text-white">{lvl.title}</h3>
                    <span className="text-xs text-purple-400 font-mono">{lvl.xp}</span>
                  </div>
                </div>

                <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase ${
                  lvl.unlocked ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-500'
                }`}>
                  {lvl.unlocked ? 'Unlocked' : 'Locked'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {lvl.items.map((item, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center space-x-3">
                    <CheckCircle className={`w-4 h-4 ${lvl.unlocked ? 'text-emerald-400' : 'text-slate-600'}`} />
                    <span className="text-xs font-semibold text-slate-200">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
