import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, ArrowRight } from 'lucide-react';

interface SessionCompleteModalProps {
  isOpen: boolean;
  onContinue: () => void;
  earnedXP: number;
}

export const SessionCompleteModal: React.FC<SessionCompleteModalProps> = ({
  isOpen,
  onContinue,
  earnedXP,
}) => {
  useEffect(() => {
    if (isOpen) {
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#ffffff', '#f59e0b', '#10b981', '#6366f1'],
        });
      } catch {
        // ignore
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      id="session-complete-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-300"
    >
      <div
        id="session-complete-modal-card"
        className="w-full max-w-sm rounded-2xl bg-[#111111] border border-white/15 shadow-2xl p-6 sm:p-8 text-white text-center flex flex-col items-center"
      >
        <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mb-4 border border-white/15 animate-bounce">
          <span className="text-2xl">🎉</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-white mb-2">
          Focus session complete
        </h3>
        <p className="text-xs text-white/60 mb-6">
          Great work sustaining your focus. Your cognitive stamina is compounding.
        </p>

        {/* XP Badge */}
        <div className="px-4 py-2 rounded-full bg-white/10 border border-white/20 flex items-center gap-2 mb-6">
          <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span className="text-sm font-semibold tracking-wide text-white">
            +{earnedXP} XP
          </span>
        </div>

        <button
          type="button"
          onClick={onContinue}
          style={{ background: 'linear-gradient(to bottom, #2B2B2B, #101010)' }}
          className="w-full py-3 rounded-xl text-sm font-medium text-white border border-white/10 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity cursor-pointer shadow-lg"
        >
          <span>Continue</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
