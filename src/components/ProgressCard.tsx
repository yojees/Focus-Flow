import React from 'react';
import { Flame } from 'lucide-react';

interface ProgressCardProps {
  completedTasksCount: number;
  totalTasksCount: number;
  focusMinutesTotal: number;
  streakDays: number;
  onOpenTasks?: () => void;
  onOpenProgress?: () => void;
}

export const ProgressCard: React.FC<ProgressCardProps> = ({
  completedTasksCount,
  totalTasksCount,
  focusMinutesTotal,
  streakDays,
  onOpenTasks,
  onOpenProgress,
}) => {
  // Format focus time e.g., 1h 45m focused
  const hours = Math.floor(focusMinutesTotal / 60);
  const mins = focusMinutesTotal % 60;
  const timeFormatted =
    hours > 0 ? `${hours}h ${mins}m focused` : `${mins}m focused`;

  // Calculate percentage
  const percentage =
    totalTasksCount > 0
      ? Math.min(100, Math.round((completedTasksCount / totalTasksCount) * 100))
      : 60;

  return (
    <div
      id="card-today-progress"
      className="flex flex-col justify-between rounded-2xl bg-white/10 backdrop-blur-lg p-5 sm:p-6 sm:w-64 border border-white/10 transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-widest font-medium text-[#010101]/70 lg:text-white/70">
          TODAY'S PROGRESS
        </span>
        {onOpenProgress && (
          <button
            type="button"
            onClick={onOpenProgress}
            className="text-[11px] text-[#010101]/60 lg:text-white/60 hover:text-[#010101] lg:hover:text-white transition-colors cursor-pointer"
          >
            Details
          </button>
        )}
      </div>

      {/* Main Stats Block */}
      <div className="my-3 flex flex-col gap-1.5">
        <div className="flex items-baseline justify-between">
          <button
            type="button"
            onClick={onOpenTasks}
            className="text-left group cursor-pointer focus:outline-none"
            title="Click to view tasks"
          >
            <span
              id="progress-tasks-stat"
              className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#010101] lg:text-white group-hover:underline underline-offset-4"
            >
              {completedTasksCount} / {totalTasksCount} tasks
            </span>
          </button>
        </div>

        <p
          id="progress-focused-stat"
          className="text-sm font-medium text-[#010101]/70 lg:text-white/70"
        >
          {timeFormatted}
        </p>

        {/* Thin progress indicator bar */}
        <div className="mt-2 flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs text-[#010101]/70 lg:text-white/70">
            <span>Daily completion</span>
            <span className="font-semibold text-[#010101] lg:text-white">
              {percentage}%
            </span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-white/15 overflow-hidden">
            <div
              id="progress-indicator-bar"
              className="h-full rounded-full bg-white transition-all duration-500 ease-out"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Bottom Streak & Momentum */}
      <div className="flex flex-col gap-1 pt-2 border-t border-white/10">
        <div className="flex items-center gap-1.5">
          <Flame className="w-4 h-4 text-orange-400 fill-orange-400 shrink-0" />
          <span
            id="streak-indicator"
            className="text-sm font-medium text-[#010101] lg:text-white"
          >
            {streakDays} day streak
          </span>
        </div>
        <p className="text-sm leading-relaxed text-[#010101]/70 lg:text-white/70">
          Keep your momentum going.
        </p>
      </div>
    </div>
  );
};
