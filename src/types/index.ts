export type AgentType = 
  | 'tutor' 
  | 'planner' 
  | 'coding' 
  | 'research' 
  | 'career' 
  | 'productivity' 
  | 'wellness'
  | 'copilot';

export interface Agent {
  id: AgentType;
  name: string;
  role: string;
  avatar: string;
  color: string;
  badge: string;
  description: string;
  systemPrompt: string;
}

export interface MissionItem {
  id: string;
  title: string;
  duration: string;
  category: 'assignment' | 'coding' | 'revision' | 'interview' | 'wellness';
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  difficulty?: 'Easy' | 'Medium' | 'Hard';
}

export interface DigitalTwinProfile {
  name: string;
  avatar: string;
  targetRole: string;
  targetCompany: string;
  targetDateDays: number;
  readinessScore: number; // 0 - 100%
  learningSpeedMultiplier: number; // e.g. 1.35x
  focusScore: number; // 0 - 100%
  streakDays: number;
  totalStudyHours: number;
  peakProductivityTime: string;
  weakTopics: Array<{ topic: string; score: number }>;
  strongTopics: Array<{ topic: string; score: number }>;
  recentVelocity: Array<{ date: string; hours: number; focus: number }>;
}

export interface DocumentItem {
  id: string;
  title: string;
  type: 'pdf' | 'ppt' | 'docx' | 'image' | 'audio';
  size: string;
  uploadDate: string;
  summary: string;
  keyConcepts: string[];
  parsedContent: string;
  quizGenerated?: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent' | 'system' | 'copilot';
  agentId?: AgentType;
  agentName?: string;
  agentAvatar?: string;
  text: string;
  timestamp: string;
  codeSnippet?: {
    language: string;
    code: string;
  };
  quizCard?: QuizQuestion;
  groundedDocs?: string[];
  suggestedActions?: string[];
}

export interface KnowledgeNode {
  id: string;
  label: string;
  category: 'java' | 'dbms' | 'dsa' | 'web' | 'ai' | 'system';
  mastery: number; // 0 - 100%
  connections: string[]; // target node IDs
  description: string;
}

export interface ProjectBlueprint {
  title: string;
  tagline: string;
  techStack: string[];
  architecture: string;
  folderStructure: string[];
  dbSchema: string[];
  apiEndpoints: string[];
  tasks: string[];
}
