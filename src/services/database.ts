import { 
  DigitalTwinProfile, 
  MissionItem, 
  DocumentItem, 
  KnowledgeNode 
} from '../types';
import { 
  INITIAL_STUDENT_PROFILE, 
  INITIAL_MISSIONS, 
  INITIAL_DOCUMENTS, 
  INITIAL_KNOWLEDGE_NODES 
} from './store';

// Storage keys for persistent database
const STORAGE_KEYS = {
  PROFILE: 'nexus_db_profile_v2',
  MISSIONS: 'nexus_db_missions_v2',
  DOCUMENTS: 'nexus_db_documents_v2',
  NODES: 'nexus_db_nodes_v2',
  USERS: 'nexus_db_users_v2',
  QUIZZES: 'nexus_db_quizzes_v2',
  CODE_PROJECTS: 'nexus_db_code_projects_v2',
  INTERVIEWS: 'nexus_db_interviews_v2',
  WELLNESS: 'nexus_db_wellness_v2'
};

export interface DatabaseStats {
  profileCount: number;
  missionCount: number;
  documentCount: number;
  nodeCount: number;
  userCount: number;
  quizCount: number;
  codeProjectCount: number;
  storageSizeBytes: number;
  lastSyncTimestamp: string;
}

class NexusDatabaseService {
  private memoryCache: {
    profile: DigitalTwinProfile;
    missions: MissionItem[];
    documents: DocumentItem[];
    nodes: KnowledgeNode[];
  };

  constructor() {
    this.memoryCache = {
      profile: this.loadItem(STORAGE_KEYS.PROFILE, INITIAL_STUDENT_PROFILE),
      missions: this.loadItem(STORAGE_KEYS.MISSIONS, []),
      documents: this.loadItem(STORAGE_KEYS.DOCUMENTS, []),
      nodes: this.loadItem(STORAGE_KEYS.NODES, [])
    };
  }

  private loadItem<T>(key: string, defaultValue: T): T {
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        return JSON.parse(stored) as T;
      }
    } catch (err) {
      console.warn(`[NexusDB] Error reading key "${key}":`, err);
    }
    return defaultValue;
  }

  private saveItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error(`[NexusDB] Error saving key "${key}":`, err);
    }
  }

  // --- Profile Operations ---
  public getProfile(): DigitalTwinProfile {
    return this.memoryCache.profile;
  }

  public saveProfile(profile: DigitalTwinProfile): void {
    this.memoryCache.profile = profile;
    this.saveItem(STORAGE_KEYS.PROFILE, profile);
  }

  // --- Missions Operations ---
  public getMissions(): MissionItem[] {
    return this.memoryCache.missions;
  }

  public saveMissions(missions: MissionItem[]): void {
    this.memoryCache.missions = missions;
    this.saveItem(STORAGE_KEYS.MISSIONS, missions);
  }

  public addMission(mission: MissionItem): void {
    const updated = [mission, ...this.memoryCache.missions];
    this.saveMissions(updated);
  }

  public toggleMission(id: string): void {
    const updated = this.memoryCache.missions.map(m => 
      m.id === id ? { ...m, completed: !m.completed } : m
    );
    this.saveMissions(updated);
  }

  public deleteMission(id: string): void {
    const updated = this.memoryCache.missions.filter(m => m.id !== id);
    this.saveMissions(updated);
  }

  // --- Documents (RAG Library) Operations ---
  public getDocuments(): DocumentItem[] {
    return this.memoryCache.documents;
  }

  public saveDocuments(documents: DocumentItem[]): void {
    this.memoryCache.documents = documents;
    this.saveItem(STORAGE_KEYS.DOCUMENTS, documents);
  }

  public addDocument(doc: DocumentItem): void {
    const updated = [doc, ...this.memoryCache.documents];
    this.saveDocuments(updated);
  }

  public deleteDocument(id: string): void {
    const updated = this.memoryCache.documents.filter(d => d.id !== id);
    this.saveDocuments(updated);
  }

  // --- Knowledge Graph Operations ---
  public getNodes(): KnowledgeNode[] {
    return this.memoryCache.nodes;
  }

  public saveNodes(nodes: KnowledgeNode[]): void {
    this.memoryCache.nodes = nodes;
    this.saveItem(STORAGE_KEYS.NODES, nodes);
  }

  // --- Database Stats & Admin Inspector ---
  public getStats(): DatabaseStats {
    let size = 0;
    Object.values(STORAGE_KEYS).forEach(key => {
      const val = localStorage.getItem(key);
      if (val) size += val.length * 2;
    });

    const userList = this.loadItem(STORAGE_KEYS.USERS, []);
    const quizList = this.loadItem(STORAGE_KEYS.QUIZZES, []);
    const codeList = this.loadItem(STORAGE_KEYS.CODE_PROJECTS, []);

    return {
      profileCount: 1,
      missionCount: this.memoryCache.missions.length,
      documentCount: this.memoryCache.documents.length,
      nodeCount: this.memoryCache.nodes.length,
      userCount: userList.length || 1,
      quizCount: quizList.length,
      codeProjectCount: codeList.length,
      storageSizeBytes: size,
      lastSyncTimestamp: new Date().toLocaleTimeString()
    };
  }

  // Export database backup JSON snapshot
  public exportBackupJSON(): string {
    const backupData = {
      version: '2.4.0',
      exportedAt: new Date().toISOString(),
      profile: this.memoryCache.profile,
      missions: this.memoryCache.missions,
      documents: this.memoryCache.documents,
      nodes: this.memoryCache.nodes
    };
    return JSON.stringify(backupData, null, 2);
  }

  // Import database backup JSON
  public importBackupJSON(jsonStr: string): boolean {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.profile) this.saveProfile(parsed.profile);
      if (parsed.missions) this.saveMissions(parsed.missions);
      if (parsed.documents) this.saveDocuments(parsed.documents);
      if (parsed.nodes) this.saveNodes(parsed.nodes);
      return true;
    } catch (err) {
      console.error('[NexusDB] Failed to parse database import JSON:', err);
      return false;
    }
  }

  // Reset database back to default initial seed data
  public resetToDefaults(): void {
    this.saveProfile(INITIAL_STUDENT_PROFILE);
    this.saveMissions(INITIAL_MISSIONS);
    this.saveDocuments(INITIAL_DOCUMENTS);
    this.saveNodes(INITIAL_KNOWLEDGE_NODES);
  }
}

export const dbService = new NexusDatabaseService();
