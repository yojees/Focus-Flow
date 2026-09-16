import React from 'react';
import { ShieldAlert, CheckCircle } from 'lucide-react';

interface DistractionModalProps {
  isOpen: boolean;
  onRecordDistraction: (reason: string) => void;
  onSkip: () => void;
}

export const DistractionModal: React.FC<DistractionModalProps> = ({
  isOpen,
  onRecordDistraction,
  onSkip,
}) => {
  if (!isOpen) return null;

  const distractions = [
    { id: 'Phone', label: '📱 Phone' },
    { id: 'YouTube', label: '📺 YouTube' },
    { id: 'Games', label: '🎮 Games' },
    { id: 'Social media', label: '💬 Social media' },
    { id: 'Tired', label: '😴 Tired' },
    { id: 'Other', label: '➕ Other' },
  ];

  return (
    <div
      id="distraction-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        id="distraction-modal-card"
        className="w-full max-w-md rounded-2xl bg-[#111111] border border-white/10 shadow-2xl p-6 sm:p-8 text-white text-center"
      >
        <div className="w-12 h-12 mx-auto rounded-full bg-white/10 flex items-center justify-center mb-4 border border-white/10">
          <ShieldAlert className="w-6 h-6 text-white" />
        </div>

        <h3 className="text-xl font-semibold tracking-tight text-white mb-2">
          Did anything distract you?
        </h3>
        <p className="text-xs text-white/60 mb-6">
          Track interruptions to optimize your deep work environment.
        </p>

        <div className="grid grid-cols-2 gap-2.5 mb-6">
          {distractions.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => onRecordDistraction(d.id)}
              className="px-3.5 py-3 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-xs font-medium text-white/90 hover:text-white transition-all text-left cursor-pointer"
            >
              {d.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => {
            onRecordDistraction('None');
            onSkip();
          }}
          className="w-full py-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <CheckCircle className="w-3.5 h-3.5" />
          <span>No distractions — Pure deep focus</span>
        </button>
      </div>
    </div>
  );
};
