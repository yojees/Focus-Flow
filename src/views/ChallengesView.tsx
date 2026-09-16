import React from 'react';
import { Trophy, Sparkles, Award, CheckCircle, Clock } from 'lucide-react';
import { Challenge } from '../types';

interface ChallengesViewProps {
  challenges: Challenge[];
  onClaimReward: (challengeId: string) => void;
}

export const ChallengesView: React.FC<ChallengesViewProps> = ({
  challenges,
  onClaimReward,
}) => {
  return (
    <div id="challenges-view" className="p-4 sm:p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h2 className="text-2xl font-semibold tracking-tight text-white">Weekly Study Quests</h2>
          </div>
          <p className="text-xs sm:text-sm text-white/60 mt-1">
            Hit weekly targets to earn bonus XP, level up faster, and maintain discipline.
          </p>
        </div>

        {/* Countdown */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white/60">
          <Clock className="w-3.5 h-3.5 text-white/40" />
          <span>Resets in 3 days</span>
        </div>
      </div>

      {/* Challenges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {challenges.map((ch) => {
          const isDone = ch.current >= ch.target;
          const percent = Math.min(100, Math.round((ch.current / ch.target) * 100));

          return (
            <div
              key={ch.id}
              className={`p-6 rounded-2xl border flex flex-col justify-between transition-all ${
                isDone
                  ? 'bg-white/10 border-white/20 shadow-md'
                  : 'bg-white/5 border-white/10'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs uppercase tracking-widest text-white/50 font-semibold">
                    {ch.type === 'sessions'
                      ? 'Pomodoro Goal'
                      : ch.type === 'hours'
                      ? 'Study Hours'
                      : ch.type === 'days'
                      ? 'Consistency'
                      : 'Coursework Goal'}
                  </span>

                  <div className="flex items-center gap-1 text-xs font-semibold text-amber-400">
                    <Sparkles className="w-3.5 h-3.5 fill-amber-400" />
                    <span>+{ch.rewardXP} XP</span>
                  </div>
                </div>

                <h3 className="text-base font-semibold text-white">{ch.title}</h3>
                <p className="text-xs text-white/60 mt-1 leading-relaxed">{ch.description}</p>
              </div>

              {/* Progress */}
              <div className="mt-6 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between text-xs text-white/70 mb-2">
                  <span>Progress</span>
                  <span className="font-mono">
                    {ch.type === 'hours'
                      ? `${Math.floor(ch.current / 60)}h ${ch.current % 60}m / ${Math.floor(ch.target / 60)}h`
                      : `${ch.current} / ${ch.target}`}
                    {' '}({percent}%)
                  </span>
                </div>

                <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden mb-3">
                  <div
                    className="h-full rounded-full bg-white transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>

                {isDone ? (
                  <button
                    type="button"
                    onClick={() => onClaimReward(ch.id)}
                    className="w-full py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-emerald-500/30"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Claim Reward</span>
                  </button>
                ) : (
                  <div className="text-[11px] text-white/40 text-center py-1">
                    In progress — Keep studying!
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
