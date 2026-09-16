import {
  Task,
  PomodoroSession,
  CalendarItem,
  Note,
  Challenge,
  DistractionEntry,
  UserProfile,
  GardenItem,
  AppSettings,
} from '../types';

export const STORAGE_KEYS = {
  PROFILE: 'focusflow_v2_profile',
  TASKS: 'focusflow_v2_tasks',
  SESSIONS: 'focusflow_v2_sessions',
  CALENDAR: 'focusflow_v2_calendar',
  NOTES: 'focusflow_v2_notes',
  CHALLENGES: 'focusflow_v2_challenges',
  DISTRACTIONS: 'focusflow_v2_distractions',
  GARDEN: 'focusflow_v2_garden',
  SETTINGS: 'focusflow_v2_settings',
  ONBOARDED: 'focusflow_v2_onboarded',
};

export const INITIAL_PROFILE: UserProfile = {
  name: '',
  primaryFocus: '',
  xp: 0,
  level: 1,
  streakDays: 0,
  lastActiveDate: new Date().toISOString().slice(0, 10),
  totalFocusMinutes: 0,
  totalSessions: 0,
  focusGoalMinutes: 120,
  sessionGoal: 4,
  taskGoal: 4,
  badges: [],
};

export const INITIAL_TASKS: Task[] = [];

export const INITIAL_SESSIONS: PomodoroSession[] = [];

export const INITIAL_CALENDAR: CalendarItem[] = [];

export const INITIAL_NOTES: Note[] = [];

export const INITIAL_CHALLENGES: Challenge[] = [
  {
    id: 'ch-1',
    title: 'Focus Starter',
    description: 'Complete 5 focused Pomodoro sessions this week.',
    target: 5,
    current: 0,
    rewardXP: 100,
    completed: false,
    type: 'sessions',
  },
  {
    id: 'ch-2',
    title: 'Deep Work Immersion',
    description: 'Log 5 hours of total focus study time.',
    target: 300, // minutes
    current: 0,
    rewardXP: 150,
    completed: false,
    type: 'hours',
  },
  {
    id: 'ch-3',
    title: 'Consistency Champion',
    description: 'Study on 5 different days during the week.',
    target: 5,
    current: 0,
    rewardXP: 120,
    rewardBadge: 'consistency_fire',
    completed: false,
    type: 'days',
  },
  {
    id: 'ch-4',
    title: 'Task Finisher',
    description: 'Complete 10 coursework tasks.',
    target: 10,
    current: 0,
    rewardXP: 130,
    completed: false,
    type: 'tasks',
  },
];

export const INITIAL_GARDEN: GardenItem[] = [
  { id: 'g-1', type: 'sprout', label: 'First Focus Sprout', requiredSessions: 1, unlocked: false, position: { x: 20, y: 35 } },
  { id: 'g-2', type: 'sapling', label: 'Birch Sapling', requiredSessions: 5, unlocked: false, position: { x: 45, y: 25 } },
  { id: 'g-3', type: 'flower', label: 'Wild Lavender Patch', requiredSessions: 10, unlocked: false, position: { x: 30, y: 65 } },
  { id: 'g-4', type: 'tree', label: 'Ancient Cedar', requiredSessions: 15, unlocked: false, position: { x: 75, y: 40 } },
  { id: 'g-5', type: 'stone', label: 'Zen Meditation Stones', requiredSessions: 20, unlocked: false, position: { x: 60, y: 70 } },
  { id: 'g-6', type: 'blossom', label: 'Cherry Blossom Tree', requiredSessions: 30, unlocked: false, position: { x: 15, y: 75 } },
  { id: 'g-7', type: 'bench', label: 'Wooden Reading Bench', requiredSessions: 40, unlocked: false, position: { x: 80, y: 75 } },
  { id: 'g-8', type: 'pond', label: 'Tranquil Koi Pond', requiredSessions: 50, unlocked: false, position: { x: 50, y: 50 } },
];

export const INITIAL_SETTINGS: AppSettings = {
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  autoStartBreaks: true,
  autoStartPomodoros: false,
  timerSound: true,
  ambientSoundVolume: 0.5,
  theme: 'dark',
};

export const INITIAL_DISTRACTIONS: DistractionEntry[] = [];

export function loadStoredData<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function saveStoredData<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // Ignore storage errors
  }
}
