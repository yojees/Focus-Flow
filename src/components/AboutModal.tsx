import React from 'react';
import { X, Clock, Target, Flame } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      id="about-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        id="about-modal-container"
        className="relative w-full max-w-lg rounded-2xl bg-[#0f0f0f]/95 border border-white/10 shadow-2xl backdrop-blur-2xl text-white p-6 sm:p-8 overflow-hidden"
      >
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-white" />
            <h2 className="text-xl font-semibold tracking-tight text-white">About FocusFlow</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close about modal"
            className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors text-white/80 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="py-5 space-y-4 text-sm text-white/80 leading-relaxed">
          <p>
            <strong className="text-white">FocusFlow</strong> is a minimal, cinematic student productivity tool created by <span className="text-white font-medium">Yojees R</span>. Designed to strip away bloated SaaS clutter and return students to deep work.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-1">
              <Clock className="w-4 h-4 text-white/90" />
              <span className="font-medium text-white text-xs">25/5 Pomodoro</span>
              <span className="text-[11px] text-white/60">Structured intervals for sustained cognitive focus</span>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-1">
              <Target className="w-4 h-4 text-white/90" />
              <span className="font-medium text-white text-xs">Intentional Tasks</span>
              <span className="text-[11px] text-white/60">Organized by subject priority & day</span>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-1">
              <Flame className="w-4 h-4 text-orange-400" />
              <span className="font-medium text-white text-xs">Streak Retention</span>
              <span className="text-[11px] text-white/60">Keep study momentum running daily</span>
            </div>
          </div>

          <p className="text-xs text-white/50 pt-2">
            All data persists locally in your browser. No sign-up wall, no subscriptions, just pure focus.
          </p>
        </div>

        <div className="pt-4 border-t border-white/10 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-full text-sm font-medium text-white transition-opacity hover:opacity-90 cursor-pointer"
            style={{ background: 'linear-gradient(to bottom, #2B2B2B, #101010)' }}
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
