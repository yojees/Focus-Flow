import React from 'react';
import {
  Sparkles,
  Flame,
  Award,
  Lock,
  CheckCircle,
  TrendingUp,
  Shield,
  Zap,
} from 'lucide-react';
import { UserProfile } from '../types';

interface ProgressViewProps {
  profile: UserProfile;
  streakDays: number;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  profile,
  streakDays,
}) => {
  // Level progression calculation
  const currentXP = profile.xp;
  const xpPerLevel = 200;
  const currentLevel = profile.level || Math.floor(currentXP / xpPerLevel) + 1;
  const xpIntoCurrentLevel = currentXP % xpPerLevel;
  const levelProgressPercent = Math.min(100, Math.round((xpIntoCurrentLevel / xpPerLevel) * 100));

  const badges = [
    {
      id: 'first_focus',
      emoji: '🌱',
      name: 'First Focus',
      description: 'Completed your very first Pomodoro focus session.',
      unlocked: profile.badges.includes('first_focus'),
      tier: 'Bronze',
    },
    {
      id: 'ten_sessions',
      emoji: '🍅',
      name: '10 Sessions',
      description: 'Logged 10 completed focus intervals.',
      unlocked: profile.badges.includes('ten_sessions'),
      tier: 'Silver',
    },
    {
      id: 'seven_streak',
      emoji: '🔥',
      name: '7 Day Streak',
      description: 'Maintained unbroken study habit for 7 consecutive days.',
      unlocked: profile.badges.includes('seven_streak'),
      tier: 'Gold',
    },
    {
      id: 'study_week',
      emoji: '📚',
      name: 'Study Week',
      description: 'Logged over 15 hours of focused coursework in a single week.',
      unlocked: profile.badges.includes('study_week'),
      tier: 'Gold',
    },
    {
      id: 'fifty_sessions',
      emoji: '⚡',
      name: '50 Sessions',
      description: 'Clocked 50 focused Pomodoro blocks.',
      unlocked: profile.badges.includes('fifty_sessions') || profile.totalSessions >= 50,
      tier: 'Platinum',
    },
    {
      id: 'twenty_hours',
      emoji: '🌳',
      name: '20 Hours Focused',
      description: 'Surpassed 20 hours of concentrated academic immersion.',
      unlocked: profile.badges.includes('twenty_hours') || profile.totalFocusMinutes >= 1200,
      tier: 'Platinum',
    },
    {
      id: 'hundred_sessions',
      emoji: '🏆',
      name: '100 Sessions',
      description: 'Century milestone: 100 deep work intervals achieved.',
      unlocked: profile.badges.includes('hundred_sessions') || profile.totalSessions >= 100,
      tier: 'Diamond',
    },
  ];

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div id="progress-view" className="p-4 sm:p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-white">Progress & Mastery</h2>
        <p className="text-xs sm:text-sm text-white/60 mt-1">
          Gamified compounding milestones, streak telemetry, and earned accolades.
        </p>
      </div>

      {/* Main XP & Level Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-3xl shrink-0 shadow-inner">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-widest text-white/50 font-semibold">
                  CURRENT RANK
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-semibold">
                  Active
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
                Level {currentLevel} · Focus Builder
              </h3>
              <p className="text-xs text-white/60 mt-0.5">
                Next Rank: Level {currentLevel + 1} · Cognitive Architect
              </p>
            </div>
          </div>

          <div className="flex sm:flex-col items-baseline sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0 border-white/10">
            <span className="text-xs text-white/50">Total Experience</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono flex items-center gap-1.5">
              <Sparkles className="w-5 h-5 text-amber-400 fill-amber-400" />
              <span>{currentXP.toLocaleString()} XP</span>
            </div>
          </div>
        </div>

        {/* Level Progress Bar */}
        <div className="mt-8">
          <div className="flex items-center justify-between text-xs text-white/70 mb-2">
            <span>Progress to Level {currentLevel + 1}</span>
            <span className="font-mono">{xpIntoCurrentLevel} / {xpPerLevel} XP ({levelProgressPercent}%)</span>
          </div>
          <div className="h-3 w-full rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-white transition-all duration-700"
              style={{ width: `${levelProgressPercent}%` }}
            />
          </div>
          <p className="text-[11px] text-white/40 mt-2">
            Earn +25 XP for each completed Pomodoro session and +10 XP for each finished task.
          </p>
        </div>
      </div>

      {/* 7-Day Streak Visualization */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white/5 border border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <Flame className="w-5 h-5 fill-orange-400" />
            </div>
            <div>
              <h4 className="text-base font-semibold text-white">
                {streakDays} Day Study Streak
              </h4>
              <p className="text-xs text-white/50">Consecutive days with at least 1 focus session</p>
            </div>
          </div>

          <span className="text-xs text-white/60 px-3 py-1 rounded-full bg-white/5 border border-white/10 self-start sm:self-auto">
            🔥 Momentum multiplier active
          </span>
        </div>

        {/* 7-day visual pills */}
        <div className="grid grid-cols-7 gap-2 sm:gap-3">
          {daysOfWeek.map((day, idx) => {
            const isCompleted = idx < streakDays;
            const isToday = idx === streakDays - 1;

            return (
              <div
                key={day}
                className={`p-3 sm:p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                  isCompleted
                    ? 'bg-white/10 border-white/25 text-white shadow-sm'
                    : 'bg-white/[0.02] border-white/5 text-white/30'
                }`}
              >
                <span className="text-xs font-semibold">{day}</span>
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${
                    isCompleted
                      ? 'bg-white text-black font-bold'
                      : 'border border-white/20 text-white/30'
                  }`}
                >
                  {isCompleted ? '✓' : ''}
                </div>
                <span className="text-[10px] text-white/50">
                  {isToday ? 'Today' : isCompleted ? 'Completed' : 'Upcoming'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Badges Collection Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Accolades & Badges</span>
            </h3>
            <p className="text-xs text-white/50">Unlock tokens of discipline as you study</p>
          </div>
          <span className="text-xs text-white/60 font-mono">
            {badges.filter((b) => b.unlocked).length} / {badges.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {badges.filter((b) => b.unlocked).length === 0 && (
            <div className="col-span-full p-4 rounded-xl bg-white/5 border border-white/10 text-center text-xs text-white/50">
              No achievements earned yet. Start your first study session to earn XP and level up.
            </div>
          )}
          {badges.map((b) => (
            <div
              key={b.id}
              className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                b.unlocked
                  ? 'bg-white/5 hover:bg-white/[0.08] border-white/15'
                  : 'bg-white/[0.02] border-white/5 opacity-40'
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-2xl shrink-0">
                {b.unlocked ? b.emoji : <Lock className="w-4 h-4 text-white/40" />}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="text-sm font-semibold text-white truncate">{b.name}</h4>
                  <span className="text-[9px] px-1.5 py-0.2 rounded font-semibold uppercase bg-white/10 text-white/70">
                    {b.tier}
                  </span>
                </div>
                <p className="text-xs text-white/60 mt-1 leading-relaxed">{b.description}</p>
                <div className="mt-2 text-[10px] font-medium text-emerald-400">
                  {b.unlocked ? '✓ Unlocked' : 'Locked milestone'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
