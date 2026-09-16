import React, { useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { UserProfile } from '../types';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (name: string, primaryFocus: string) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onComplete,
}) => {
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [primaryFocus, setPrimaryFocus] = useState('Study');

  if (!isOpen) return null;

  const focusOptions = [
    { id: 'Study', label: 'Study' },
    { id: 'Coding', label: 'Coding' },
    { id: 'Exams', label: 'Exams' },
    { id: 'Projects', label: 'Projects' },
    { id: 'General productivity', label: 'General productivity' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = name.trim();
    if (!finalName) {
      setError('Please enter your name to continue.');
      return;
    }
    setError(null);
    onComplete(finalName, primaryFocus);
  };

  return (
    <div
      id="onboarding-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300"
    >
      <div
        id="onboarding-modal-card"
        className="w-full max-w-md rounded-2xl bg-[#111111] border border-white/10 shadow-2xl p-6 sm:p-8 text-white"
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-white">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-xs uppercase tracking-widest text-white/60 font-semibold">
            Welcome to FocusFlow
          </span>
        </div>

        <h2 className="text-2xl font-semibold tracking-tight text-white mb-2">
          Let's tailor your focus space.
        </h2>
        <p className="text-sm text-white/60 mb-6">
          Set up your workspace in just two quick questions.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-medium text-white/70 mb-2">
              What should we call you?
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Enter your name"
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder-white/40 focus:outline-none focus:border-white/30"
              autoFocus
            />
            {error && (
              <p className="mt-2 text-xs text-rose-400 font-medium">
                {error}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-white/70 mb-2">
              What's your main focus?
            </label>
            <div className="grid grid-cols-2 gap-2">
              {focusOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setPrimaryFocus(opt.id)}
                  className={`px-3.5 py-2.5 rounded-xl text-xs font-medium border text-left transition-all cursor-pointer ${
                    primaryFocus === opt.id
                      ? 'bg-white/15 border-white/30 text-white'
                      : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            style={{ background: 'linear-gradient(to bottom, #2B2B2B, #101010)' }}
            className="w-full mt-4 py-3 rounded-xl text-sm font-medium text-white border border-white/10 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity cursor-pointer shadow-lg"
          >
            <span>Enter Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
