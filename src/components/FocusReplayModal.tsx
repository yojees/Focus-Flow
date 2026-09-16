import React from 'react';
import { X, Flame, CheckCircle, Timer, Sparkles, BookOpen } from 'lucide-react';
import { Task, PomodoroSession } from '../types';

interface FocusReplayModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: PomodoroSession[];
  tasks: Task[];
  streakDays: number;
}

export const FocusReplayModal: React.FC<FocusReplayModalProps> = ({
  isOpen,
  onClose,
  sessions,
  tasks,
  streakDays,
}) => {
  if (!isOpen) return null;

  // Calculate today's sessions
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

  const todaySessions = sessions.filter((s) => s.timestamp >= todayStart);
  const totalFocusMinutes = todaySessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const hours = Math.floor(totalFocusMinutes / 60);
  const mins = totalFocusMinutes % 60;
  const formattedTime = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

  const completedTodayTasks = tasks.filter((t) => t.completed && t.group === 'today');
  const upcomingTasks = tasks.filter((t) => !t.completed).slice(0, 3);

  // Subject breakdown for today
  const subjectCounts: Record<string, number> = {};
  todaySessions.forEach((s) => {
    subjectCounts[s.subject] = (subjectCounts[s.subject] || 0) + s.durationMinutes;
  });

  let topSubject = 'General Study';
  let maxTime = 0;
  Object.entries(subjectCounts).forEach(([subj, time]) => {
    if (time > maxTime) {
      maxTime = time;
      topSubject = subj;
    }
  });

  return (
    <div
      id="focus-replay-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        id="focus-replay-card"
        className="w-full max-w-md rounded-2xl bg-[#0f0f0f] border border-white/15 shadow-2xl p-6 sm:p-8 text-white relative overflow-hidden"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close daily replay"
          className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors text-white/80 hover:text-white cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-xs uppercase tracking-widest text-white/60 font-semibold">
            Daily Focus Replay
          </span>
        </div>

        <h3 className="text-2xl font-bold tracking-tight text-white mb-6">
          YOUR DAY
        </h3>

        {sessions.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-xl">
              ⏱️
            </div>
            <h4 className="text-base font-semibold text-white">Daily Replay Unavailable</h4>
            <p className="text-xs text-white/50 max-w-xs mx-auto leading-relaxed">
              Complete at least one focus session to unlock your daily replay.
            </p>
          </div>
        ) : (
          <>
            {/* 4 Key Pillars */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                <span className="text-xs text-white/50 block mb-1">Sessions</span>
                <div className="flex items-center gap-1.5 text-lg font-semibold text-white">
                  <span>🍅</span>
                  <span>{todaySessions.length} completed</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                <span className="text-xs text-white/50 block mb-1">Time Focused</span>
                <div className="flex items-center gap-1.5 text-lg font-semibold text-white">
                  <span>⏱️</span>
                  <span>{formattedTime}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                <span className="text-xs text-white/50 block mb-1">Tasks Finished</span>
                <div className="flex items-center gap-1.5 text-lg font-semibold text-white">
                  <span>✅</span>
                  <span>{completedTodayTasks.length} tasks</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                <span className="text-xs text-white/50 block mb-1">Study Streak</span>
                <div className="flex items-center gap-1.5 text-lg font-semibold text-white">
                  <Flame className="w-4 h-4 text-orange-400 fill-orange-400" />
                  <span>{streakDays} days</span>
                </div>
              </div>
            </div>

            {/* Most Focused Subject */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-4 h-4 text-white/70" />
                <span className="text-xs text-white/60">Most focused subject:</span>
              </div>
              <span className="text-sm font-semibold text-white">{topSubject}</span>
            </div>

            {/* Tomorrow's Priorities */}
            <div className="mb-6">
              <h4 className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-2.5">
                Tomorrow's Focus Priorities
              </h4>
              <div className="space-y-2">
                {upcomingTasks.length > 0 ? (
                  upcomingTasks.map((t, idx) => (
                    <div
                      key={t.id}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/5 text-xs text-white/90"
                    >
                      <span className="text-white/40 font-mono text-[11px]">{idx + 1}.</span>
                      <span className="truncate">{t.title}</span>
                      <span className="ml-auto text-[10px] text-white/50">{t.subject}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-white/40 italic">
                    All scheduled tasks completed! Add new tasks in the Tasks tab.
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        <button
          type="button"
          onClick={onClose}
          style={{ background: 'linear-gradient(to bottom, #2B2B2B, #101010)' }}
          className="w-full py-3 rounded-xl text-sm font-medium text-white border border-white/10 hover:opacity-90 transition-opacity cursor-pointer text-center"
        >
          Close Replay
        </button>
      </div>
    </div>
  );
};
