import { DigitalTwinProfile, MissionItem, DocumentItem, KnowledgeNode } from '../types';

// Empty initial profile - will be filled from backend/login
export const INITIAL_STUDENT_PROFILE: DigitalTwinProfile = {
  name: 'Student',
  avatar: '👩‍🎓',
  targetRole: '',
  targetCompany: '',
  targetDateDays: 0,
  readinessScore: 0,
  learningSpeedMultiplier: 1.0,
  focusScore: 0,
  streakDays: 0,
  totalStudyHours: 0,
  peakProductivityTime: '',
  weakTopics: [],
  strongTopics: [],
  recentVelocity: []
};

// No default missions - start empty, user adds their own
export const INITIAL_MISSIONS: MissionItem[] = [];

// No default documents - start empty, user uploads their own
export const INITIAL_DOCUMENTS: DocumentItem[] = [];

// Default knowledge nodes (empty - user creates from their learning)
export const INITIAL_KNOWLEDGE_NODES: KnowledgeNode[] = [];

export const COMMUNITY_AGENTS = [
  { id: 'aws', name: 'AWS Cloud Coach', role: 'Solutions Architect', avatar: '☁️', desc: 'Prepares for AWS Certified Developer & Cloud Architecture.', rating: '4.9 ⭐', installed: true },
  { id: 'gate', name: 'GATE CS Mentor', role: 'Competitive Exam Specialist', avatar: '🎓', desc: 'Mock tests & revision strategies for GATE Computer Science.', rating: '4.8 ⭐', installed: false },
  { id: 'upsc', name: 'UPSC Civil Mentor', role: 'General Studies Coach', avatar: '🏛️', desc: 'Current affairs synthesis & mains essay evaluation.', rating: '4.7 ⭐', installed: false },
  { id: 'react', name: 'React 19 Architect', role: 'Frontend Expert', avatar: '⚛️', desc: 'Server Components, Hooks, and modern React patterns.', rating: '5.0 ⭐', installed: true },
  { id: 'cyber', name: 'CyberSec Shield', role: 'Ethical Hacking Mentor', avatar: '🛡️', desc: 'Web security, OWASP Top 10 & penetration testing concepts.', rating: '4.9 ⭐', installed: false },
  { id: 'ielts', name: 'IELTS / TOEFL Tutor', role: 'Verbal & Essay Coach', avatar: '🗣️', desc: 'Speaking practice & essay scoring feedback.', rating: '4.8 ⭐', installed: false }
];
