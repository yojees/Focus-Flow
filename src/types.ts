export type SessionType = 'focus' | 'shortBreak' | 'longBreak';

export type Priority = 'high' | 'medium' | 'low';

export type TaskGroup = 'today' | 'upcoming';

export interface Task {
  id: string;
  title: string;
  description?: string;
  subject: string;
  priority: Priority;
  completed: boolean;
  group: TaskGroup;
  dueDate?: string; // YYYY-MM-DD
  estimatedPomodoros: number;
  completedPomodoros: number;
  createdAt: number;
  order: number;
}

export interface PomodoroSession {
  id: string;
  timestamp: number;
  durationMinutes: number;
  type: SessionType;
  subject: string;
  taskTitle?: string;
  taskId?: string;
  completed: boolean;
  distraction?: string;
}

export type CalendarEventType = 'task' | 'exam' | 'assignment' | 'event' | 'study';

export interface CalendarItem {
  id: string;
  title: string;
  type: CalendarEventType;
  date: string; // YYYY-MM-DD
  time?: string;
  subject?: string;
  notes?: string;
  completed?: boolean;
}

export type NoteCategory = 'study' | 'ideas' | 'revision' | 'coding' | 'important';

export interface Note {
  id: string;
  title: string;
  content: string;
  category: NoteCategory;
  isPinned: boolean;
  isArchived: boolean;
  updatedAt: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  rewardXP: number;
  rewardBadge?: string;
  completed: boolean;
  type: 'sessions' | 'hours' | 'days' | 'tasks';
}

export interface DistractionEntry {
  id: string;
  timestamp: number;
  reason: string;
}

export interface UserProfile {
  name: string;
  primaryFocus: string;
  xp: number;
  level: number;
  streakDays: number;
  lastActiveDate: string;
  totalFocusMinutes: number;
  totalSessions: number;
  focusGoalMinutes: number; // e.g. 180 (3 hours)
  sessionGoal: number; // e.g. 6 sessions
  taskGoal: number; // e.g. 5 tasks
  badges: string[];
}

export interface UserProgress {
  focusMinutes: number;
  completedSessions: number;
  streakDays: number;
  lastActiveDate: string;
  targetMinutes: number;
}

export interface GardenItem {
  id: string;
  type: 'sprout' | 'sapling' | 'tree' | 'blossom' | 'pond' | 'bench' | 'flower' | 'stone';
  label: string;
  requiredSessions: number;
  unlocked: boolean;
  position: { x: number; y: number };
}

export interface AppSettings {
  focusDuration: number; // in minutes, default 25
  shortBreakDuration: number; // in minutes, default 5
  longBreakDuration: number; // in minutes, default 15
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  timerSound: boolean;
  ambientSoundVolume: number;
  theme: 'dark' | 'light' | 'system';
}

export type AppPage =
  | 'overview'
  | 'focus'
  | 'tasks'
  | 'calendar'
  | 'analytics'
  | 'progress'
  | 'garden'
  | 'notes'
  | 'sounds'
  | 'challenges'
  | 'settings';
