import React from 'react';
import {
  Flame,
  Timer,
  CheckCircle2,
  ArrowRight,
  Play,
  Clock,
  BookOpen,
  Target,
} from 'lucide-react';
import { Task, PomodoroSession, UserProfile } from '../types';

interface OverviewViewProps {
  profile: UserProfile;
  tasks: Task[];
  sessions: PomodoroSession[];
  onStartFocus: (task?: Task) => void;
  onNavigateToTasks: () => void;
  onToggleTask: (taskId: string) => void;
  streakDays: number;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  profile,
  tasks,
  sessions,
  onStartFocus,
  onNavigateToTasks,
  onToggleTask,
  streakDays,
}) => {
  // Time-of-day greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Format focus time helper (e.g., '0 min', '25 min', '50 min', '1h 40min')
  const formatFocusDuration = (totalMins: number) => {
    if (!totalMins || totalMins === 0) return '0 min';
    const h = Math.floor(totalMins / 60);
    const m = totalMins % 60;
    if (h === 0) return `${m} min`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}min`;
  };

  // Today's stats calculation based strictly on actual sessions completed today
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const todaySessions = sessions.filter(
    (s) => s.timestamp >= todayStart && (s.type === 'focus' || !s.type)
  );
  const todayFocusMinutes = todaySessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const timeFormatted = formatFocusDuration(todayFocusMinutes);

  const todayTasks = tasks.filter((t) => t.group === 'today');
  const completedTodayTasks = todayTasks.filter((t) => t.completed);

  // Top 3 priority tasks
  const topPriorities = tasks
    .filter((t) => !t.completed)
    .sort((a, b) => {
      const pOrder = { high: 0, medium: 1, low: 2 };
      return pOrder[a.priority] - pOrder[b.priority];
    })
    .slice(0, 3);

  // Recent 3 sessions
  const recentSessions = [...sessions].reverse().slice(0, 4);

  // Daily goal progress
  const targetMinutes = profile.focusGoalMinutes || 180;
  const dailyPercent = Math.min(100, Math.round((todayFocusMinutes / targetMinutes) * 100));

  return (
    <div id="overview-dashboard" className="p-4 sm:p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Greeting Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white flex items-center gap-2">
            <span>{getGreeting()}{profile.name ? `, ${profile.name}` : ''}</span>
            <span className="text-2xl">👋</span>
          </h2>
          <p className="text-xs sm:text-sm text-white/60 mt-1">
            {profile.primaryFocus
              ? `Focus zone calibrated for ${profile.primaryFocus}. Ready for deep study?`
              : 'Focus zone calibrated. Ready for deep study?'}
          </p>
        </div>

        {/* Daily Goal Quick Badge */}
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-xs self-start sm:self-auto">
          <Target className="w-4 h-4 text-emerald-400" />
          <div>
            <span className="text-white/50 block text-[10px]">Today's Goal</span>
            <span className="text-white font-medium">
              {dailyPercent}% ({timeFormatted} / {Math.round(targetMinutes / 60)}h)
            </span>
          </div>
        </div>
      </div>

      {/* 4 Stat Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1: Today's Focus */}
        <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-white/60">
            <span>Today's Focus</span>
            <Timer className="w-4 h-4 text-white/70" />
          </div>
          <div className="mt-4">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {timeFormatted}
            </span>
            <span className="text-xs text-white/50 block mt-1">Target: {Math.round(targetMinutes / 60)}h 00m</span>
          </div>
        </div>

        {/* Stat 2: Today's Tasks */}
        <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-white/60">
            <span>Today's Tasks</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-4">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {completedTodayTasks.length} / {todayTasks.length}
            </span>
            <span className="text-xs text-white/50 block mt-1">completed assignments</span>
          </div>
        </div>

        {/* Stat 3: Current Streak */}
        <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-white/60">
            <span>Current Streak</span>
            <Flame className="w-4 h-4 text-orange-400 fill-orange-400" />
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                {streakDays}
              </span>
              <span className="text-sm font-medium text-white/70">days</span>
            </div>
            <span className="text-xs text-white/50 block mt-1">Keep your streak alive</span>
          </div>
        </div>

        {/* Stat 4: Daily Goal Bar */}
        <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-white/60">
            <span>Daily Goal</span>
            <span className="font-semibold text-white">{dailyPercent}%</span>
          </div>
          <div className="mt-4">
            <div className="h-2 w-full rounded-full bg-white/15 overflow-hidden mb-2">
              <div
                className="h-full rounded-full bg-white transition-all duration-500"
                style={{ width: `${dailyPercent}%` }}
              />
            </div>
            <span className="text-xs text-white/50 block">
              {dailyPercent >= 100 ? 'Goal accomplished! 🎉' : `${Math.max(0, targetMinutes - todayFocusMinutes)}m left to goal`}
            </span>
          </div>
        </div>
      </div>

      {/* Main Center Grid: Quick Start & Today's Priorities */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Quick Start Card (5 cols) */}
        <div className="lg:col-span-5 p-6 sm:p-8 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/10 flex flex-col justify-between">
          <div>
            <span className="text-xs uppercase tracking-widest text-white/50 font-semibold block mb-1">
              QUICK START POMODORO
            </span>
            <p className="text-xs text-white/60">
              Launch into single-task immersion.
            </p>
          </div>

          <div className="my-8 text-center">
            <div
              style={{ fontFamily: "'Silkscreen', cursive" }}
              className="text-5xl sm:text-6xl tracking-tight text-white select-none tabular-nums"
            >
              25:00
            </div>
            <p className="text-xs text-white/50 mt-2">
              Standard 25 min focus · 5 min break
            </p>
          </div>

          <button
            type="button"
            id="overview-start-focus-btn"
            onClick={() => onStartFocus()}
            style={{ background: 'linear-gradient(to bottom, #2B2B2B, #101010)' }}
            className="w-full py-3.5 rounded-xl text-sm font-medium text-white border border-white/15 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity cursor-pointer shadow-lg"
          >
            <Play className="w-4 h-4 fill-current ml-0.5" />
            <span>Start Focus Session</span>
          </button>
        </div>

        {/* Today's Priorities (7 cols) */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-white">Today's Priorities</h3>
              <p className="text-xs text-white/50">Top urgent tasks to tackle today</p>
            </div>
            <button
              type="button"
              onClick={onNavigateToTasks}
              className="text-xs text-white/60 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>View all ({tasks.length})</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3 my-2">
            {topPriorities.length > 0 ? (
              topPriorities.map((task) => (
                <div
                  key={task.id}
                  className="group flex items-center justify-between p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <button
                      type="button"
                      onClick={() => onToggleTask(task.id)}
                      className="w-5 h-5 rounded-md border border-white/30 hover:border-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
                    >
                      {task.completed && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    </button>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-white truncate group-hover:text-white">
                        {task.title}
                      </p>
                      <div className="flex items-center gap-2 text-[11px] text-white/50 mt-0.5">
                        <span>{task.subject}</span>
                        <span>·</span>
                        <span
                          className={`capitalize ${
                            task.priority === 'high'
                              ? 'text-rose-400'
                              : task.priority === 'medium'
                              ? 'text-amber-400'
                              : 'text-emerald-400'
                          }`}
                        >
                          {task.priority} Priority
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onStartFocus(task)}
                    className="opacity-80 group-hover:opacity-100 ml-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-white font-medium flex items-center gap-1 transition-all cursor-pointer shrink-0"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Focus</span>
                  </button>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-white/40">
                {tasks.length === 0
                  ? 'No tasks scheduled yet. Add your first assignment or exam to start your study plan.'
                  : 'All top tasks are completed! Enjoy your focus session or add more tasks.'}
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-white/50">
            <span>{completedTodayTasks.length} of {todayTasks.length} today tasks completed</span>
            <button
              type="button"
              onClick={onNavigateToTasks}
              className="text-white/80 hover:text-white underline underline-offset-4 cursor-pointer"
            >
              + Add new task
            </button>
          </div>
        </div>
      </div>

      {/* Recent Sessions List */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-white">Recent Focus Sessions</h3>
            <p className="text-xs text-white/50">Your latest logged intervals of concentration</p>
          </div>
          <Clock className="w-4 h-4 text-white/50" />
        </div>

        {recentSessions.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {recentSessions.map((s, idx) => (
              <div
                key={s.id || idx}
                className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-medium text-white">{s.subject}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/70">
                    {s.durationMinutes} min
                  </span>
                </div>
                <p className="text-xs text-white/60 truncate">
                  {s.taskTitle || 'Focused study block'}
                </p>
                <span className="text-[10px] text-white/40 mt-2 block">
                  {new Date(s.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center rounded-xl bg-white/[0.02] border border-white/5 text-xs text-white/40">
            No study sessions logged today. Start a focus timer to record your progress.
          </div>
        )}
      </div>
    </div>
  );
};
