import React, { useState, useEffect, useCallback } from 'react';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { SignUpPage } from './components/SignUpPage';
import { AdminPortal } from './components/AdminPortal';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { CopilotOmnibar } from './components/CopilotOmnibar';
import { DatabaseModal } from './components/DatabaseModal';
import { MissionControl } from './components/MissionControl';
import { DigitalTwin } from './components/DigitalTwin';
import { AIChat } from './components/AIChat';
import { AILibrary } from './components/AILibrary';
import { SmartPlanner } from './components/SmartPlanner';
import { KnowledgeGraph } from './components/KnowledgeGraph';
import { CodingLab } from './components/CodingLab';
import { PlacementHub } from './components/PlacementHub';
import { VisionWorkspace } from './components/VisionWorkspace';
import { VoiceMentor } from './components/VoiceMentor';
import { QuizStudio } from './components/QuizStudio';
import { StudyRooms } from './components/StudyRooms';
import { LifeOS } from './components/LifeOS';
import { AgentMarketplace } from './components/AgentMarketplace';

import { DigitalTwinProfile, MissionItem, DocumentItem, KnowledgeNode } from './types';
import { apiService } from './services/api';
import { INITIAL_STUDENT_PROFILE } from './services/store';

// Session storage key for logged-in user
const SESSION_KEY = 'nexus_session_user';
const TAB_KEY = 'nexus_active_tab';

export const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<'landing' | 'app' | 'login' | 'signup' | 'admin'>('landing');
  const [activeTab, setActiveTabState] = useState(() => {
    try { return localStorage.getItem(TAB_KEY) || 'mission-control'; } catch { return 'mission-control'; }
  });

  const setActiveTab = (tab: string) => {
    setActiveTabState(tab);
    try { localStorage.setItem(TAB_KEY, tab); } catch {}
  };

  // Logged-in user
  const [currentUser, setCurrentUser] = useState<{ id: string; name: string; email: string; avatar: string; role: string } | null>(() => {
    try {
      const saved = localStorage.getItem(SESSION_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Profile derived from user
  const [profile, setProfile] = useState<DigitalTwinProfile>(() => {
    const saved = localStorage.getItem(SESSION_KEY);
    if (saved) {
      const user = JSON.parse(saved);
      return { ...INITIAL_STUDENT_PROFILE, name: user.name, avatar: user.avatar || '👩‍🎓' };
    }
    return INITIAL_STUDENT_PROFILE;
  });

  // App data - loaded from backend per user
  const [missions, setMissions] = useState<MissionItem[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [nodes, setNodes] = useState<KnowledgeNode[]>([]);

  const [omnibarOpen, setOmnibarOpen] = useState(false);
  const [dbModalOpen, setDbModalOpen] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);

  // Restore session on mount
  useEffect(() => {
    if (currentUser) {
      setViewMode('app');
      loadUserData(currentUser.id);
    }
  }, []);

  // Load missions and documents from backend for a given user
  const loadUserData = useCallback(async (userId: string) => {
    setDataLoading(true);
    try {
      const [userMissions, userDocs] = await Promise.all([
        apiService.getMissions(userId),
        apiService.getDocuments(userId)
      ]);
      setMissions(userMissions || []);
      setDocuments(userDocs || []);
    } catch (err) {
      // Keep empty if load fails
      setMissions([]);
      setDocuments([]);
    } finally {
      setDataLoading(false);
    }
  }, []);

  const handleLoginSuccess = async (email: string, name?: string, userId?: string, avatar?: string) => {
    const user = {
      id: userId || `usr-${Date.now()}`,
      name: name || email.split('@')[0],
      email,
      avatar: avatar || '👩‍🎓',
      role: 'Student'
    };
    setCurrentUser(user);
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    setProfile(prev => ({ ...prev, name: user.name, avatar: user.avatar }));
    setViewMode('app');
    await loadUserData(user.id);
  };

  const handleSignUpSuccess = async (name: string, email: string, avatar: string, userId?: string) => {
    const user = {
      id: userId || `usr-${Date.now()}`,
      name,
      email,
      avatar,
      role: 'Student'
    };
    setCurrentUser(user);
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    setProfile(prev => ({ ...prev, name, avatar }));
    setMissions([]);
    setDocuments([]);
    setViewMode('app');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(TAB_KEY);
    setMissions([]);
    setDocuments([]);
    setProfile(INITIAL_STUDENT_PROFILE);
    setViewMode('landing');
  };

  const handleRefreshFromDb = async () => {
    if (currentUser) {
      await loadUserData(currentUser.id);
    }
  };

  const handleOpenVoice = () => {
    setViewMode('app');
    setActiveTab('voice-mentor');
  };

  if (viewMode === 'landing') {
    return (
      <LandingPage
        onEnterOS={() => setViewMode('login')}
        onNavigateToLogin={() => setViewMode('login')}
        onNavigateToSignUp={() => setViewMode('signup')}
      />
    );
  }

  if (viewMode === 'login') {
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        onNavigateToSignUp={() => setViewMode('signup')}
        onNavigateToLanding={() => setViewMode('landing')}
      />
    );
  }

  if (viewMode === 'signup') {
    return (
      <SignUpPage
        onSignUpSuccess={handleSignUpSuccess}
        onNavigateToLogin={() => setViewMode('login')}
        onNavigateToLanding={() => setViewMode('landing')}
      />
    );
  }

  if (viewMode === 'admin') {
    return (
      <AdminPortal
        onBackToApp={() => setViewMode('app')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top OS Header */}
      <Header
        profile={profile}
        onOpenOmnibar={() => setOmnibarOpen(true)}
        onOpenVoice={handleOpenVoice}
        onOpenLanding={() => setViewMode('landing')}
        onOpenLogin={() => setViewMode('login')}
        onOpenSignUp={() => setViewMode('signup')}
        onOpenAdminPortal={() => setViewMode('admin')}
        onLogout={handleLogout}
        activeTab={activeTab}
        currentUser={currentUser}
      />

      {/* Main OS Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Dynamic Main Workspace Content */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-[#07090e] via-[#0b0f19] to-[#07090e] cyber-grid">
          {dataLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center space-x-3 text-cyan-400 font-mono text-xs">
                <div className="w-4 h-4 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin"></div>
                <span>Loading your workspace data...</span>
              </div>
            </div>
          )}

          {!dataLoading && (
            <>
              {activeTab === 'mission-control' && (
                <MissionControl
                  profile={profile}
                  missions={missions}
                  setMissions={setMissions}
                  onNavigate={setActiveTab}
                  userId={currentUser?.id}
                />
              )}

              {activeTab === 'digital-twin' && (
                <DigitalTwin profile={profile} />
              )}

              {activeTab === 'ai-chat' && (
                <AIChat documents={documents} currentUser={currentUser} />
              )}

              {activeTab === 'ai-library' && (
                <AILibrary
                  documents={documents}
                  setDocuments={setDocuments}
                  onNavigate={setActiveTab}
                  userId={currentUser?.id}
                />
              )}

              {activeTab === 'smart-planner' && (
                <SmartPlanner missions={missions} setMissions={setMissions} userId={currentUser?.id} />
              )}

              {activeTab === 'knowledge-graph' && (
                <KnowledgeGraph nodes={nodes} />
              )}

              {activeTab === 'coding-lab' && (
                <CodingLab />
              )}

              {activeTab === 'placement-hub' && (
                <PlacementHub profile={profile} />
              )}

              {activeTab === 'vision-workspace' && (
                <VisionWorkspace />
              )}

              {activeTab === 'voice-mentor' && (
                <VoiceMentor />
              )}

              {activeTab === 'quiz-studio' && (
                <QuizStudio />
              )}

              {activeTab === 'study-rooms' && (
                <StudyRooms />
              )}

              {activeTab === 'life-os' && (
                <LifeOS profile={profile} />
              )}

              {activeTab === 'agent-marketplace' && (
                <AgentMarketplace />
              )}
            </>
          )}
        </main>
      </div>

      {/* Global Academic Copilot Omnibar Modal */}
      <CopilotOmnibar
        isOpen={omnibarOpen}
        onClose={() => setOmnibarOpen(false)}
        onNavigate={setActiveTab}
      />

      {/* Database Inspector & Control Console Modal */}
      <DatabaseModal
        isOpen={dbModalOpen}
        onClose={() => setDbModalOpen(false)}
        onRefreshData={handleRefreshFromDb}
      />
    </div>
  );
};

export default App;
