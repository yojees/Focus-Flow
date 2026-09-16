import React from 'react';
import { X, Flame, Sparkles, Timer, CheckSquare, Award } from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  tasksCompleted?: number;
  onUpdateName?: (name: string) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  tasksCompleted = 0,
}) => {
  if (!isOpen) return null;

  const totalHours = Math.floor(profile.totalFocusMinutes / 60);
  const totalMins = profile.totalFocusMinutes % 60;
  const timeFormatted = `${totalHours}h ${totalMins}m`;

  const badgesList = [
    { id: 'first_focus', title: '🌱 First Focus', desc: 'Completed your 1st focus session' },
    { id: 'ten_sessions', title: '🍅 10 Sessions', desc: 'Completed 10 Pomodoros' },
    { id: 'seven_streak', title: '🔥 7 Day Streak', desc: 'Maintained 7 consecutive study days' },
    { id: 'study_week', title: '📚 Study Week', desc: 'Logged over 15 hours in one week' },
    { id: 'fifty_sessions', title: '⚡ 50 Sessions', desc: 'Achieved 50 deep focus sessions' },
    { id: 'hundred_sessions', title: '🏆 100 Sessions', desc: 'Century mark in focused learning' },
    { id: 'twenty_hours', title: '🌳 20 Hours Focused', desc: 'Logged 20 hours of total study time' },
  ];

  return (
    <div
      id="profile-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        id="profile-modal-card"
        className="w-full max-w-lg rounded-2xl bg-[#0f0f0f] border border-white/15 shadow-2xl p-6 sm:p-8 text-white relative max-h-[90vh] overflow-y-auto"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close profile"
          className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors text-white/80 hover:text-white cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Profile Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-neutral-800 to-neutral-600 border border-white/20 flex items-center justify-center text-2xl font-bold text-white shadow-md">
            {profile.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>{profile.name}</span>
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-0.5 rounded-full bg-white/10 text-xs text-white/80 font-medium">
                Level {profile.level} · Focus Builder
              </span>
              <span className="flex items-center gap-1 text-xs text-orange-400 font-medium">
                <Flame className="w-3.5 h-3.5 fill-orange-400" />
                <span>{profile.streakDays}-day streak</span>
              </span>
            </div>
          </div>
        </div>

        {/* Lifetime Totals Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-center">
            <Timer className="w-4 h-4 mx-auto text-white/60 mb-1" />
            <span className="text-[11px] text-white/50 block">Total Focus</span>
            <span className="text-sm sm:text-base font-bold text-white">{timeFormatted}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-center">
            <Sparkles className="w-4 h-4 mx-auto text-amber-400 mb-1" />
            <span className="text-[11px] text-white/50 block">Sessions</span>
            <span className="text-sm sm:text-base font-bold text-white">{profile.totalSessions}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-center">
            <CheckSquare className="w-4 h-4 mx-auto text-emerald-400 mb-1" />
            <span className="text-[11px] text-white/50 block">Tasks Done</span>
            <span className="text-sm sm:text-base font-bold text-white">{tasksCompleted}</span>
          </div>
        </div>

        {/* Earned Badges Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-semibold text-white/80 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Earned Badges ({profile.badges.length})</span>
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {badgesList.map((b) => {
              const isUnlocked = profile.badges.includes(b.id);
              return (
                <div
                  key={b.id}
                  className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${
                    isUnlocked
                      ? 'bg-white/5 border-white/15'
                      : 'bg-white/[0.02] border-white/5 opacity-40'
                  }`}
                >
                  <div className="text-xl shrink-0">{b.title.slice(0, 2)}</div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold text-white truncate">
                      {b.title.slice(2)}
                    </div>
                    <div className="text-[10px] text-white/50 truncate">{b.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          style={{ background: 'linear-gradient(to bottom, #2B2B2B, #101010)' }}
          className="w-full py-2.5 rounded-xl text-sm font-medium text-white border border-white/10 hover:opacity-90 transition-opacity cursor-pointer text-center"
        >
          Close Profile
        </button>
      </div>
    </div>
  );
};
