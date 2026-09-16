import React, { useState, useEffect, useRef } from 'react';
import { AppPage, Task, PomodoroSession, CalendarItem, Note, Challenge, DistractionEntry, UserProfile, GardenItem, AppSettings, SessionType } from './types';
import {
  STORAGE_KEYS,
  INITIAL_PROFILE,
  INITIAL_TASKS,
  INITIAL_SESSIONS,
  INITIAL_CALENDAR,
  INITIAL_NOTES,
  INITIAL_CHALLENGES,
  INITIAL_GARDEN,
  INITIAL_SETTINGS,
  INITIAL_DISTRACTIONS,
  loadStoredData,
  saveStoredData,
} from './utils/storage';
import { ambientSound, AmbientSoundType } from './utils/ambientSound';
import { playChime } from './utils/audio';

// Navigation & Layout Components
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { PageBackground } from './components/PageBackground';

// Modals
import { OnboardingModal } from './components/OnboardingModal';
import { SessionCompleteModal } from './components/SessionCompleteModal';
import { DistractionModal } from './components/DistractionModal';
import { FocusReplayModal } from './components/FocusReplayModal';
import { ProfileModal } from './components/ProfileModal';
import { QuickNotesDrawer } from './components/QuickNotesDrawer';

// Views
import { LandingView } from './views/LandingView';
import { OverviewView } from './views/OverviewView';
import { FocusView } from './views/FocusView';
import { TasksView } from './views/TasksView';
import { CalendarView } from './views/CalendarView';
import { AnalyticsView } from './views/AnalyticsView';
import { ProgressView } from './views/ProgressView';
import { GardenView } from './views/GardenView';
import { NotesView } from './views/NotesView';
import { SoundsView } from './views/SoundsView';
import { ChallengesView } from './views/ChallengesView';
import { SettingsView } from './views/SettingsView';

export default function App() {
  // Main view mode: 'landing' or 'app'
  const [viewMode, setViewMode] = useState<'landing' | 'app'>('landing');
  const [activePage, setActivePage] = useState<AppPage>('overview');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Persistent States
  const [profile, setProfile] = useState<UserProfile>(() =>
    loadStoredData(STORAGE_KEYS.PROFILE, INITIAL_PROFILE)
  );
  const [tasks, setTasks] = useState<Task[]>(() =>
    loadStoredData(STORAGE_KEYS.TASKS, INITIAL_TASKS)
  );
  const [sessions, setSessions] = useState<PomodoroSession[]>(() =>
    loadStoredData(STORAGE_KEYS.SESSIONS, INITIAL_SESSIONS)
  );
  const [calendarItems, setCalendarItems] = useState<CalendarItem[]>(() =>
    loadStoredData(STORAGE_KEYS.CALENDAR, INITIAL_CALENDAR)
  );
  const [notes, setNotes] = useState<Note[]>(() =>
    loadStoredData(STORAGE_KEYS.NOTES, INITIAL_NOTES)
  );
  const [challenges, setChallenges] = useState<Challenge[]>(() =>
    loadStoredData(STORAGE_KEYS.CHALLENGES, INITIAL_CHALLENGES)
  );
  const [gardenItems, setGardenItems] = useState<GardenItem[]>(() =>
    loadStoredData(STORAGE_KEYS.GARDEN, INITIAL_GARDEN)
  );
  const [settings, setSettings] = useState<AppSettings>(() =>
    loadStoredData(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS)
  );
  const [distractions, setDistractions] = useState<DistractionEntry[]>(() =>
    loadStoredData(STORAGE_KEYS.DISTRACTIONS, INITIAL_DISTRACTIONS)
  );
  const [isOnboarded, setIsOnboarded] = useState<boolean>(() =>
    loadStoredData(STORAGE_KEYS.ONBOARDED, false)
  );

  // Active Task for Pomodoro Focus
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  // Global ambient sound state
  const [activeSoundName, setActiveSoundName] = useState<string | null>(null);
  const [soundVolume, setSoundVolume] = useState<number>(0.5);

  // Modals state
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isSessionCompleteOpen, setIsSessionCompleteOpen] = useState(false);
  const [isDistractionModalOpen, setIsDistractionModalOpen] = useState(false);
  const [isReplayOpen, setIsReplayOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isQuickNotesOpen, setIsQuickNotesOpen] = useState(false);
  const [lastEarnedXP, setLastEarnedXP] = useState(25);

  // Sync state to LocalStorage
  useEffect(() => saveStoredData(STORAGE_KEYS.PROFILE, profile), [profile]);
  useEffect(() => saveStoredData(STORAGE_KEYS.TASKS, tasks), [tasks]);
  useEffect(() => saveStoredData(STORAGE_KEYS.SESSIONS, sessions), [sessions]);
  useEffect(() => saveStoredData(STORAGE_KEYS.CALENDAR, calendarItems), [calendarItems]);
  useEffect(() => saveStoredData(STORAGE_KEYS.NOTES, notes), [notes]);
  useEffect(() => saveStoredData(STORAGE_KEYS.CHALLENGES, challenges), [challenges]);
  useEffect(() => saveStoredData(STORAGE_KEYS.GARDEN, gardenItems), [gardenItems]);
  useEffect(() => saveStoredData(STORAGE_KEYS.SETTINGS, settings), [settings]);
  useEffect(() => saveStoredData(STORAGE_KEYS.DISTRACTIONS, distractions), [distractions]);
  useEffect(() => saveStoredData(STORAGE_KEYS.ONBOARDED, isOnboarded), [isOnboarded]);

  // Handle switching to App from Landing
  const handleEnterApp = (enteredName?: string) => {
    const finalName = enteredName?.trim() || profile.name.trim();
    if (finalName) {
      setProfile((prev) => ({
        ...prev,
        name: finalName,
      }));
      setIsOnboarded(true);
      setViewMode('app');
      setActivePage('overview');
    } else {
      setIsOnboardingOpen(true);
    }
  };

  const handleCompleteOnboarding = (name: string, primaryFocus: string) => {
    setProfile((prev) => ({
      ...prev,
      name,
      primaryFocus,
    }));
    setIsOnboarded(true);
    setIsOnboardingOpen(false);
    setViewMode('app');
    setActivePage('overview');
  };

  // Sound handlers
  const handleToggleSoundType = (type: AmbientSoundType) => {
    const isNowPlaying = ambientSound.toggle(type);
    if (isNowPlaying) {
      setActiveSoundName(type);
    } else {
      setActiveSoundName(null);
    }
  };

  const handleToggleCurrentSound = () => {
    if (activeSoundName) {
      ambientSound.stop();
      setActiveSoundName(null);
    } else {
      ambientSound.play('rain');
      setActiveSoundName('rain');
    }
  };

  const handleVolumeChange = (vol: number) => {
    setSoundVolume(vol);
    ambientSound.setVolume(vol);
  };

  // Session Completion Handler
  const handleSessionComplete = (sessionData: {
    durationMinutes: number;
    type: SessionType;
    subject: string;
    taskTitle?: string;
    taskId?: string;
  }) => {
    const newSession: PomodoroSession = {
      id: `s-${Date.now()}`,
      timestamp: Date.now(),
      durationMinutes: sessionData.durationMinutes,
      type: sessionData.type,
      subject: sessionData.subject,
      taskTitle: sessionData.taskTitle,
      taskId: sessionData.taskId,
      completed: true,
    };

    setSessions((prev) => [newSession, ...prev]);

    // If associated with a task, increment completedPomodoros
    if (sessionData.taskId) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === sessionData.taskId
            ? { ...t, completedPomodoros: t.completedPomodoros + 1 }
            : t
        )
      );
    }

    // Award +25 XP and update profile
    const xpReward = 25;
    setLastEarnedXP(xpReward);
    setProfile((prev) => {
      const newTotalMins = prev.totalFocusMinutes + sessionData.durationMinutes;
      const newTotalSessions = prev.totalSessions + 1;
      const newXP = prev.xp + xpReward;
      const newLevel = Math.floor(newXP / 200) + 1;

      // Check badges
      const newBadges = [...prev.badges];
      if (!newBadges.includes('first_focus')) newBadges.push('first_focus');
      if (newTotalSessions >= 10 && !newBadges.includes('ten_sessions')) newBadges.push('ten_sessions');
      if (newTotalSessions >= 50 && !newBadges.includes('fifty_sessions')) newBadges.push('fifty_sessions');
      if (newTotalSessions >= 100 && !newBadges.includes('hundred_sessions')) newBadges.push('hundred_sessions');
      if (newTotalMins >= 1200 && !newBadges.includes('twenty_hours')) newBadges.push('twenty_hours');

      return {
        ...prev,
        xp: newXP,
        level: newLevel,
        totalFocusMinutes: newTotalMins,
        totalSessions: newTotalSessions,
        badges: newBadges,
      };
    });

    // Update challenges progress
    setChallenges((prev) =>
      prev.map((ch) => {
        if (ch.type === 'sessions' && !ch.completed) {
          const nextVal = ch.current + 1;
          return { ...ch, current: nextVal, completed: nextVal >= ch.target };
        }
        if (ch.type === 'hours' && !ch.completed) {
          const nextVal = ch.current + sessionData.durationMinutes;
          return { ...ch, current: nextVal, completed: nextVal >= ch.target };
        }
        return ch;
      })
    );

    setIsSessionCompleteOpen(true);
  };

  // Close celebration and open distraction check
  const handleContinueAfterComplete = () => {
    setIsSessionCompleteOpen(false);
    setIsDistractionModalOpen(true);
  };

  const handleRecordDistraction = (reason: string) => {
    if (reason && reason !== 'None') {
      const entry: DistractionEntry = {
        id: `d-${Date.now()}`,
        timestamp: Date.now(),
        reason,
      };
      setDistractions((prev) => [entry, ...prev]);
    }
    setIsDistractionModalOpen(false);
  };

  // Task Actions
  const handleAddTask = (newTask: Omit<Task, 'id' | 'createdAt' | 'order' | 'completedPomodoros'>) => {
    const task: Task = {
      ...newTask,
      id: `task-${Date.now()}`,
      completedPomodoros: 0,
      createdAt: Date.now(),
      order: tasks.length,
    };
    setTasks((prev) => [task, ...prev]);
  };

  const handleToggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const isNowCompleted = !t.completed;
          if (isNowCompleted) {
            // Reward +10 XP for task completion
            setProfile((p) => ({ ...p, xp: p.xp + 10 }));
          }
          return { ...t, completed: isNowCompleted };
        }
        return t;
      })
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleMoveTask = (id: string, direction: 'up' | 'down') => {
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= tasks.length) return;

    const updated = [...tasks];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setTasks(updated);
  };

  const handleStartFocusOnTask = (task?: Task) => {
    if (task) setActiveTask(task);
    setActivePage('focus');
    setViewMode('app');
  };

  // Calendar Actions
  const handleAddCalendarItem = (item: Omit<CalendarItem, 'id'>) => {
    const newItem: CalendarItem = {
      ...item,
      id: `cal-${Date.now()}`,
    };
    setCalendarItems((prev) => [newItem, ...prev]);
  };

  const handleDeleteCalendarItem = (id: string) => {
    setCalendarItems((prev) => prev.filter((i) => i.id !== id));
  };

  // Note Actions
  const handleAddNote = (note: Omit<Note, 'id' | 'updatedAt'>) => {
    const newNote: Note = {
      ...note,
      id: `note-${Date.now()}`,
      updatedAt: Date.now(),
    };
    setNotes((prev) => [newNote, ...prev]);
  };

  const handleUpdateNote = (id: string, updates: Partial<Note>) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, ...updates, updatedAt: Date.now() } : n))
    );
  };

  const handleDeleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  // Quick Notes in Focus
  const handleSaveQuickNote = (text: string) => {
    handleAddNote({
      title: text.slice(0, 30) + (text.length > 30 ? '...' : ''),
      content: text,
      category: 'ideas',
      isPinned: false,
      isArchived: false,
    });
  };

  // Challenge Claims
  const handleClaimChallenge = (id: string) => {
    setChallenges((prev) =>
      prev.map((ch) => {
        if (ch.id === id) {
          setProfile((p) => ({ ...p, xp: p.xp + ch.rewardXP }));
          playChime('bell');
          return { ...ch, completed: true, current: ch.target };
        }
        return ch;
      })
    );
  };

  // Data Export & Import
  const handleExportData = () => {
    const exportPayload = {
      profile,
      tasks,
      sessions,
      calendarItems,
      notes,
      challenges,
      distractions,
      settings,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `focusflow-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (jsonStr: string) => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.profile) setProfile(data.profile);
      if (data.tasks) setTasks(data.tasks);
      if (data.sessions) setSessions(data.sessions);
      if (data.calendarItems) setCalendarItems(data.calendarItems);
      if (data.notes) setNotes(data.notes);
      if (data.challenges) setChallenges(data.challenges);
      if (data.distractions) setDistractions(data.distractions);
      if (data.settings) setSettings(data.settings);
      alert('Data restored successfully!');
    } catch {
      alert('Invalid backup file.');
    }
  };

  const handleResetWorkspace = () => {
    if (confirm('Reset workspace and clear all data? This will restore a clean fresh slate.')) {
      setProfile(INITIAL_PROFILE);
      setTasks(INITIAL_TASKS);
      setSessions(INITIAL_SESSIONS);
      setCalendarItems(INITIAL_CALENDAR);
      setNotes(INITIAL_NOTES);
      setChallenges(INITIAL_CHALLENGES);
      setDistractions(INITIAL_DISTRACTIONS);
      setGardenItems(INITIAL_GARDEN);
      setSettings(INITIAL_SETTINGS);
      setIsOnboarded(false);
      setViewMode('landing');
    }
  };

  // If on landing view, render the landing hero
  if (viewMode === 'landing') {
    return (
      <main id="focusflow-app-root">
        <LandingView
          onEnterApp={handleEnterApp}
          streakDays={profile.streakDays}
          initialName={profile.name}
        />

        {/* First time Onboarding Modal */}
        <OnboardingModal
          isOpen={isOnboardingOpen}
          onComplete={handleCompleteOnboarding}
        />
      </main>
    );
  }

  // Full-featured Application Shell
  return (
    <div id="focusflow-app-shell" className="flex h-screen w-full bg-[#0a0a0a] text-white overflow-hidden select-none font-sans antialiased">
      {/* Persistent Left Sidebar */}
      <Sidebar
        activePage={activePage}
        onNavigate={(page) => setActivePage(page)}
        onReturnToLanding={() => setViewMode('landing')}
        streakDays={profile.streakDays}
        isMobileNavOpen={isMobileNavOpen}
        setIsMobileNavOpen={setIsMobileNavOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Bar */}
        <TopBar
          activePage={activePage}
          onToggleMobileNav={() => setIsMobileNavOpen(!isMobileNavOpen)}
          onNavigateToFocus={() => setActivePage('focus')}
          onOpenProfile={() => setIsProfileOpen(true)}
          onOpenReplay={() => setIsReplayOpen(true)}
          isTimerRunning={false}
          timerSecondsLeft={1500}
          activeSoundName={activeSoundName}
          onToggleSound={handleToggleCurrentSound}
          profile={profile}
        />

        {/* Page Content Body with smooth scrolling and subtle ambient page background */}
        <main id="main-content-scroll" className="flex-1 overflow-y-auto overflow-x-hidden relative bg-[#0a0a0a]">
          <PageBackground page={activePage}>
            {activePage === 'overview' && (
              <OverviewView
                profile={profile}
                tasks={tasks}
                sessions={sessions}
                onStartFocus={(t) => handleStartFocusOnTask(t)}
                onNavigateToTasks={() => setActivePage('tasks')}
                onToggleTask={handleToggleTask}
                streakDays={profile.streakDays}
              />
            )}

            {activePage === 'focus' && (
              <FocusView
                tasks={tasks}
                activeTask={activeTask}
                onSelectActiveTask={(t) => setActiveTask(t)}
                onSessionComplete={handleSessionComplete}
                onOpenQuickNotes={() => setIsQuickNotesOpen(true)}
                settings={settings}
              />
            )}

            {activePage === 'tasks' && (
              <TasksView
                tasks={tasks}
                onAddTask={handleAddTask}
                onToggleTask={handleToggleTask}
                onDeleteTask={handleDeleteTask}
                onMoveTask={handleMoveTask}
                onStartFocus={(t) => handleStartFocusOnTask(t)}
              />
            )}

            {activePage === 'calendar' && (
              <CalendarView
                calendarItems={calendarItems}
                tasks={tasks}
                sessions={sessions}
                onAddCalendarItem={handleAddCalendarItem}
                onDeleteCalendarItem={handleDeleteCalendarItem}
              />
            )}

            {activePage === 'analytics' && (
              <AnalyticsView
                sessions={sessions}
                tasks={tasks}
                distractions={distractions}
                streakDays={profile.streakDays}
              />
            )}

            {activePage === 'progress' && (
              <ProgressView
                profile={profile}
                streakDays={profile.streakDays}
              />
            )}

            {activePage === 'garden' && (
              <GardenView
                gardenItems={gardenItems}
                totalSessions={profile.totalSessions}
              />
            )}

            {activePage === 'notes' && (
              <NotesView
                notes={notes}
                onAddNote={handleAddNote}
                onUpdateNote={handleUpdateNote}
                onDeleteNote={handleDeleteNote}
              />
            )}

            {activePage === 'sounds' && (
              <SoundsView
                activeSoundName={activeSoundName}
                onToggleSoundType={handleToggleSoundType}
                volume={soundVolume}
                onVolumeChange={handleVolumeChange}
              />
            )}

            {activePage === 'challenges' && (
              <ChallengesView
                challenges={challenges}
                onClaimReward={handleClaimChallenge}
              />
            )}

            {activePage === 'settings' && (
              <SettingsView
                settings={settings}
                profile={profile}
                onUpdateSettings={setSettings}
                onUpdateProfile={(up) => setProfile((p) => ({ ...p, ...up }))}
                onExportData={handleExportData}
                onImportData={handleImportData}
                onResetData={handleResetWorkspace}
              />
            )}
          </PageBackground>
        </main>
      </div>

      {/* Global Modals & Drawers */}
      <SessionCompleteModal
        isOpen={isSessionCompleteOpen}
        onContinue={handleContinueAfterComplete}
        earnedXP={lastEarnedXP}
      />

      <DistractionModal
        isOpen={isDistractionModalOpen}
        onRecordDistraction={handleRecordDistraction}
        onSkip={() => setIsDistractionModalOpen(false)}
      />

      <FocusReplayModal
        isOpen={isReplayOpen}
        onClose={() => setIsReplayOpen(false)}
        sessions={sessions}
        tasks={tasks}
        streakDays={profile.streakDays}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={profile}
        tasksCompleted={tasks.filter((t) => t.completed).length}
      />

      <QuickNotesDrawer
        isOpen={isQuickNotesOpen}
        onClose={() => setIsQuickNotesOpen(false)}
        onSaveQuickNote={handleSaveQuickNote}
        recentNotes={notes}
      />
    </div>
  );
}
