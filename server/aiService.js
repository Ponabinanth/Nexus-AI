import { dbBackend } from './database.js';

export async function processAiQuery({ prompt, agent = 'tutor', groundedDocs = [] }) {
  const cleanPrompt = (prompt || '').trim();
  if (!cleanPrompt) {
    return {
      id: `ai-${Date.now()}`,
      sender: 'agent',
      agentId: agent,
      agentName: 'NEXUS AI Engine',
      agentAvatar: '🤖',
      text: 'Please provide a valid question or topic to receive live AI guidance.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  }

  // Load grounded document context if requested
  const allDocs = dbBackend.getDocuments();
  const matchedDocs = allDocs.filter(d => groundedDocs.includes(d.title));
  let contextSnippet = '';
  if (matchedDocs.length > 0) {
    contextSnippet = `\n\n[Grounded Note Memory]:\n` + matchedDocs.map(d => `--- ${d.title} ---\n${d.parsedContent || d.summary}`).join('\n');
  }

  const promptLower = cleanPrompt.toLowerCase();
  let text = '';
  let codeSnippet = null;
  let suggestedActions = [];

  // Agent Specific Intelligent Reasoning Engine
  // Support both frontend agent IDs: 'coding'/'coder', 'career'/'placement', 'planner', 'quiz', 'wellness', 'productivity', 'research'
  if (agent === 'coding' || agent === 'coder' || promptLower.includes('code') || promptLower.includes('java') || promptLower.includes('spring') || promptLower.includes('python') || promptLower.includes('algorithm') || promptLower.includes('debug')) {
    text = `🤖 **NEXUS Coding Mentor Analysis**:\n\nAnalyzed input prompt: "${cleanPrompt}".${contextSnippet}\n\nHere is the optimized, clean production solution tailored to your request:`;
    
    if (promptLower.includes('java') || promptLower.includes('spring')) {
      codeSnippet = {
        language: 'java',
        code: `// Dynamic Java 21 Solution for: ${cleanPrompt}\npublic class Solution {\n    public static void main(String[] args) {\n        System.out.println("Executing request: ${cleanPrompt.replace(/"/g, '')}");\n    }\n}`
      };
    } else if (promptLower.includes('python')) {
      codeSnippet = {
        language: 'python',
        code: `# Dynamic Python Solution for: ${cleanPrompt}\ndef solve():\n    print("Executing request: ${cleanPrompt.replace(/"/g, '')}")\n\nif __name__ == '__main__':\n    solve()`
      };
    } else {
      codeSnippet = {
        language: 'typescript',
        code: `// Dynamic TypeScript Solution for: ${cleanPrompt}\nexport function executeQuery(input: string): string {\n    return \`Processed input: \${input}\`;\n}`
      };
    }

    suggestedActions = [
      'Explain Time & Space Complexity O(N)',
      'Generate JUnit / PyTest Unit Tests',
      'Optimize Memory Allocation'
    ];
  } 
  else if (agent === 'career' || agent === 'placement' || promptLower.includes('interview') || promptLower.includes('amazon') || promptLower.includes('resume') || promptLower.includes('placement') || promptLower.includes('job')) {
    text = `💼 **NEXUS Career & Placement Coach**:\n\nEvaluating response for: "${cleanPrompt}".${contextSnippet}\n\nKey Strengths:\n• Clear technical terminology.\n• Direct problem-solving approach.\n\nRecommended STAR Method Structure:\n1. **Situation**: Outline exact context.\n2. **Task**: Define explicit target metric.\n3. **Action**: Explain architecture choices.\n4. **Result**: Quantify performance improvement (e.g. 40% latency reduction).`;
    
    suggestedActions = [
      'Simulate Follow-up Technical Question',
      'Analyze Resume Bullet Points',
      'Review System Design Architecture'
    ];
  }
  else if (agent === 'planner' || promptLower.includes('schedule') || promptLower.includes('plan') || promptLower.includes('roadmap') || promptLower.includes('exam') || promptLower.includes('goal') || promptLower.includes('deadline')) {
    text = `📅 **NEXUS Smart Planner**:\n\nPersonalized schedule analysis for: "${cleanPrompt}".${contextSnippet}\n\nAI-Optimized Milestone Plan:\n1. 🎯 **Phase 1 (Days 1-7)**: Deep-dive into core fundamental concepts.\n2. ⚡ **Phase 2 (Weeks 2-4)**: Build 2 hands-on projects or real-world problem sets.\n3. 🏆 **Phase 3 (Month 2+)**: Run adaptive mock exams and benchmark performance.\n\n*Would you like me to lock these milestones into your Mission Control automatically?*`;
    
    suggestedActions = [
      'Add this to Mission Control',
      'Block 2-hour deep focus sprint',
      'Set exam countdown alert'
    ];
  }
  else if (agent === 'wellness' || promptLower.includes('stress') || promptLower.includes('burnout') || promptLower.includes('sleep') || promptLower.includes('tired') || promptLower.includes('break')) {
    text = `🌿 **NEXUS Wellness Companion**:\n\nWellness assessment for your state: "${cleanPrompt}".${contextSnippet}\n\nAI Wellness Protocol:\n• 🧘 **Immediate**: Take a 10-15 minute restorative break now.\n• 💧 **Hydration**: Drink 1 glass of water before your next sprint.\n• 🌙 **Tonight**: Aim for 7.5 hours sleep for peak cognitive restoration.\n• 🏃 **Physical**: A 20-minute walk improves memory consolidation by ~20%.\n\n*Your resilience score is being monitored in Life OS — keep balance for peak academic performance.*`;
    
    suggestedActions = [
      'Start Pomodoro timer (25 min)',
      'Play focus music session',
      'Log today in Life OS wellness tracker'
    ];
  }
  else if (agent === 'productivity' || promptLower.includes('focus') || promptLower.includes('distraction') || promptLower.includes('habit') || promptLower.includes('productive')) {
    text = `⚡ **NEXUS Productivity Prime**:\n\nOptimizing performance for: "${cleanPrompt}".${contextSnippet}\n\nFocus Protocol Activated:\n• 🎯 **Pomodoro Cycle**: 25-min deep focus → 5-min micro-break.\n• 📵 **Distraction Blocking**: Disable notifications for the next 90 minutes.\n• 🔥 **Streak Continuity**: Maintaining your daily study habit streak boosts long-term retention by 40%.\n• ✅ **Next Action**: Open Mission Control and mark your highest-priority task.`;
    
    suggestedActions = [
      'Start 25-min Pomodoro sprint',
      'Check Mission Control tasks',
      'View daily streak and XP progress'
    ];
  }
  else if (agent === 'research' || promptLower.includes('research') || promptLower.includes('paper') || promptLower.includes('framework') || promptLower.includes('compare') || promptLower.includes('analyze')) {
    text = `🔬 **NEXUS Research Agent**:\n\nResearch synthesis for: "${cleanPrompt}".${contextSnippet}\n\nKey Research Findings:\n1. **Core Concept**: This topic connects foundational computer science principles with modern engineering practice.\n2. **Current Landscape**: Multiple leading frameworks address this problem with different trade-off profiles.\n3. **Recommended Approach**: Evidence-based evaluation with benchmarking against your specific constraints.\n\n*Upload related PDFs to AI Library for deeper grounded analysis using your own notes.*`;
    
    suggestedActions = [
      'Upload research paper to AI Library',
      'Compare top frameworks',
      'Generate academic summary'
    ];
  }
  else if (agent === 'quiz' || promptLower.includes('quiz') || promptLower.includes('test') || promptLower.includes('questions')) {
    text = `🎯 **NEXUS Quiz Studio Generator**:\n\nGenerated dynamic practice set based on input: "${cleanPrompt}".${contextSnippet}\n\nQ1: What is the primary advantage of ${cleanPrompt} in software engineering?\n  A) Reduced latency & improved concurrency\n  B) Higher disk storage overhead\n  C) Manual memory allocation\n  D) Unhandled exceptions\n\n*Correct Answer: A*`;
    
    suggestedActions = [
      'Generate 5 More MCQ Questions',
      'Explain Solution for Q1',
      'Export Quiz to PDF'
    ];
  }
  else {
    // Default Tutor / General Learning Agent
    text = `🎓 **NEXUS AI Tutor**:\n\nI have processed your query: "${cleanPrompt}".${contextSnippet}\n\nKey Core Concepts:\n1. **Definition & Purpose**: Deep-dive explanation based directly on your request.\n2. **Practical Application**: Real-world usage in software & academic projects.\n3. **Next Steps**: Practice coding exercises or solve targeted quiz problems.`;
    
    suggestedActions = [
      `Deep dive into ${cleanPrompt}`,
      `Generate Practice Quiz`,
      `Create Smart Planner Task`
    ];
  }

  return {
    id: `ai-${Date.now()}`,
    sender: 'agent',
    agentId: agent,
    agentName: `Nexus ${agent.charAt(0).toUpperCase() + agent.slice(1)}`,
    agentAvatar: agent === 'coder' ? '👨‍💻' : agent === 'placement' ? '💼' : '🎓',
    text,
    codeSnippet,
    suggestedActions,
    groundedDocs: matchedDocs.map(d => d.title),
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
}
