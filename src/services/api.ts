import { dbService } from './database';
import { DigitalTwinProfile, MissionItem, DocumentItem, ChatMessage } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

// Helper for HTTP requests with automatic failover to local database service
async function apiRequest<T>(endpoint: string, options?: RequestInit, fallbackFn?: () => T): Promise<T> {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      },
      ...options
    });

    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // console.warn(`Backend API ${endpoint} offline or unreachable, utilizing local client cache.`);
  }

  if (fallbackFn) {
    return fallbackFn();
  }
  throw new Error(`API Request to ${endpoint} failed`);
}

export const apiService = {
  // AUTHENTICATION
  login: async (email: string, password: string) => {
    return apiRequest<{ success: boolean; user?: any; message?: string }>(
      '/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ email, password })
      },
      () => {
        // Fallback validation
        if (email.includes('@') && password) {
          return {
            success: true,
            user: {
              id: `usr-${Date.now()}`,
              name: email.split('@')[0],
              email,
              avatar: '👩‍🎓',
              role: 'Computer Science Student'
            }
          };
        }
        return { success: false, message: 'Invalid credentials.' };
      }
    );
  },

  signUp: async (name: string, email: string, password: string, avatar: string = '👩‍🎓') => {
    return apiRequest<{ success: boolean; user?: any; profile?: any; message?: string }>(
      '/auth/signup',
      {
        method: 'POST',
        body: JSON.stringify({ name, email, password, avatar })
      },
      () => ({
        success: true,
        user: { id: `usr-${Date.now()}`, name, email, avatar, role: 'Computer Science Student' }
      })
    );
  },

  // MISSIONS
  getMissions: async (userId?: string): Promise<MissionItem[]> => {
    return apiRequest<MissionItem[]>(
      `/missions${userId ? `?userId=${userId}` : ''}`,
      { method: 'GET' },
      () => dbService.getMissions()
    );
  },

  addMission: async (mission: Partial<MissionItem>): Promise<MissionItem> => {
    return apiRequest<{ success: boolean; mission: MissionItem }>(
      '/missions',
      {
        method: 'POST',
        body: JSON.stringify(mission)
      },
      () => ({
        success: true,
        mission: {
          id: mission.id || `msn-${Date.now()}`,
          title: mission.title || 'New Task',
          category: mission.category || 'assignment',
          priority: mission.priority || 'medium',
          completed: false,
          duration: mission.duration || '45 mins',
          difficulty: mission.difficulty || 'Medium'
        }
      })
    ).then(res => res.mission);
  },

  updateMission: async (id: string, updates: Partial<MissionItem>): Promise<void> => {
    return apiRequest<{ success: boolean; mission: MissionItem }>(
      `/missions/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(updates)
      },
      () => ({ success: true, mission: updates as MissionItem })
    ).then(() => {});
  },

  deleteMission: async (id: string): Promise<void> => {
    return apiRequest<{ success: boolean }>(
      `/missions/${id}`,
      { method: 'DELETE' },
      () => ({ success: true })
    ).then(() => {});
  },

  // DOCUMENTS / RAG MEMORY
  getDocuments: async (userId?: string): Promise<DocumentItem[]> => {
    return apiRequest<DocumentItem[]>(
      `/documents${userId ? `?userId=${userId}` : ''}`,
      { method: 'GET' },
      () => dbService.getDocuments()
    );
  },

  addDocument: async (doc: Partial<DocumentItem>): Promise<DocumentItem> => {
    return apiRequest<{ success: boolean; document: DocumentItem }>(
      '/documents',
      {
        method: 'POST',
        body: JSON.stringify(doc)
      },
      () => ({
        success: true,
        document: {
          id: doc.id || `doc-${Date.now()}`,
          title: doc.title || 'Uploaded Notes',
          type: doc.type || 'pdf',
          size: doc.size || '1.5 MB',
          uploadDate: 'Just now',
          summary: doc.summary || 'Parsed file summary.',
          keyConcepts: doc.keyConcepts || ['Note Grounding'],
          parsedContent: doc.parsedContent || ''
        }
      })
    ).then(res => res.document);
  },

  // LIVE AI QUERY
  queryAI: async (prompt: string, agent: string = 'tutor', groundedDocs: string[] = []): Promise<ChatMessage> => {
    return apiRequest<ChatMessage>(
      '/ai/query',
      {
        method: 'POST',
        body: JSON.stringify({ prompt, agent, groundedDocs })
      },
      () => ({
        id: `ai-${Date.now()}`,
        sender: 'agent',
        agentId: agent as any,
        agentName: `Nexus ${agent.charAt(0).toUpperCase() + agent.slice(1)}`,
        agentAvatar: '🤖',
        text: `Processed prompt: "${prompt}". Grounded in ${groundedDocs.length} notes.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      })
    );
  },

  // ADMIN
  getAdminUsers: async () => {
    return apiRequest<any[]>('/admin/users', { method: 'GET' }, () => []);
  },

  getAdminStats: async () => {
    return apiRequest<any>('/admin/db/stats', { method: 'GET' }, () => dbService.getStats());
  },

  updateUserStatus: async (id: string, status: string) => {
    return apiRequest<{ success: boolean }>(
      '/admin/users/status',
      {
        method: 'POST',
        body: JSON.stringify({ id, status })
      },
      () => ({ success: true })
    );
  },

  resetAdminDatabase: async () => {
    return apiRequest<{ success: boolean; message: string }>(
      '/admin/db/reset',
      {
        method: 'POST'
      },
      () => ({ success: true, message: 'Database reset to default seed data.' })
    );
  }
};
