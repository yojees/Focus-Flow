import React from 'react';
import { X, Flame, Target, CheckCircle2, RotateCcw } from 'lucide-react';
import { UserProgress } from '../types';

interface ProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: UserProgress;
  completedTasksCount: number;
  totalTasksCount: number;
  onResetProgress: () => void;
}

export const ProgressModal: React.FC<ProgressModalProps> = ({
  isOpen,
  onClose,
  progress,
  completedTasksCount,
  totalTasksCount,
  onResetProgress,
}) => {
  if (!isOpen) return null;

  const hours = Math.floor(progress.focusMinutes / 60);
  const mins = progress.focusMinutes % 60;
  const timeFormatted = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

  return (
    <div
      id="progress-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        id="progress-modal-container"
        className="relative w-full max-w-lg rounded-2xl bg-[#0f0f0f]/95 border border-white/10 shadow-2xl backdrop-blur-2xl text-white p-6 sm:p-8 overflow-hidden"
      >
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-white flex items-center gap-2">
              <span>Study Performance</span>
            </h2>
            <p className="text-xs text-white/60 mt-0.5">
              Cumulative metrics saved directly in your browser.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close progress modal"
            className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors text-white/80 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="py-6 grid grid-cols-2 gap-3.5">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between">
            <span className="text-xs text-white/60 font-medium">Time Focused</span>
            <div className="mt-2 text-2xl font-bold tracking-tight text-white">
              {timeFormatted}
            </div>
            <span className="text-[11px] text-white/40 mt-1">Total focus sessions logged</span>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between">
            <span className="text-xs text-white/60 font-medium">Completed Cycles</span>
            <div className="mt-2 text-2xl font-bold tracking-tight text-white">
              {progress.completedSessions}
            </div>
            <span className="text-[11px] text-white/40 mt-1">Pomodoro intervals finished</span>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between">
            <span className="text-xs text-white/60 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Tasks Progress</span>
            </span>
            <div className="mt-2 text-2xl font-bold tracking-tight text-white">
              {completedTasksCount} / {totalTasksCount}
            </div>
            <span className="text-[11px] text-white/40 mt-1">Active syllabus assignments</span>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between">
            <span className="text-xs text-white/60 font-medium flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
              <span>Streak</span>
            </span>
            <div className="mt-2 text-2xl font-bold tracking-tight text-white">
              {progress.streakDays} days
            </div>
            <span className="text-[11px] text-white/40 mt-1">Consecutive study days</span>
          </div>
        </div>

        <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={onResetProgress}
            className="flex items-center gap-1.5 text-white/50 hover:text-rose-300 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset today's progress</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-full text-sm font-medium text-white transition-opacity hover:opacity-90 cursor-pointer"
            style={{ background: 'linear-gradient(to bottom, #2B2B2B, #101010)' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
