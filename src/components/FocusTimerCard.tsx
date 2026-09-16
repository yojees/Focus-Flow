import React, { useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';
import { SessionType } from '../types';
import { playChime } from '../utils/audio';

interface FocusTimerCardProps {
  sessionType: SessionType;
  timeLeft: number;
  isActive: boolean;
  sessionCount: number;
  onToggleTimer: () => void;
  onResetTimer: () => void;
  onSkipSession: () => void;
  onSwitchSessionType: (type: SessionType) => void;
}

export const FocusTimerCard: React.FC<FocusTimerCardProps> = ({
  sessionType,
  timeLeft,
  isActive,
  sessionCount,
  onToggleTimer,
  onResetTimer,
  onSkipSession,
  onSwitchSessionType,
}) => {
  const previousIsActiveRef = useRef(isActive);

  useEffect(() => {
    if (previousIsActiveRef.current !== isActive) {
      playChime('click');
      previousIsActiveRef.current = isActive;
    }
  }, [isActive]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const sessionLabel =
    sessionType === 'focus'
      ? 'Focus Session'
      : sessionType === 'shortBreak'
      ? 'Short Break'
      : 'Long Break';

  const sessionDetail =
    sessionType === 'focus'
      ? '25 min focus · 5 min break'
      : sessionType === 'shortBreak'
      ? '5 min quick recharge'
      : '15 min deep refresh';

  return (
    <div
      id="card-focus-timer"
      className="flex flex-col justify-between rounded-2xl bg-white/10 backdrop-blur-lg p-5 sm:p-6 sm:w-64 border border-white/10 transition-all duration-300"
    >
      {/* Top Session Label + Mode switcher */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs uppercase tracking-widest font-medium text-[#010101]/70 lg:text-white/70">
          CURRENT SESSION
        </span>
        {sessionCount > 0 && (
          <span
            id="session-cycle-indicator"
            className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-white/10 text-[#010101]/80 lg:text-white/80"
            title={`Completed ${sessionCount} focus sessions`}
          >
            #{sessionCount + 1}
          </span>
        )}
      </div>

      {/* Main Timer Display */}
      <div className="my-4 flex items-center justify-between">
        <div
          id="focus-timer-display"
          style={{ fontFamily: "'Silkscreen', cursive", fontWeight: 'normal' }}
          className="text-3xl sm:text-4xl tracking-tight text-[#010101] lg:text-white select-none tabular-nums"
        >
          {formattedTime}
        </div>

        {/* Small circular play/pause button + reset button */}
        <div className="flex items-center gap-2">
          {timeLeft !== (sessionType === 'focus' ? 1500 : sessionType === 'shortBreak' ? 300 : 900) && (
            <button
              type="button"
              id="timer-reset-button"
              onClick={onResetTimer}
              title="Reset Timer"
              aria-label="Reset timer"
              className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-[#010101] lg:text-white transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            id="timer-play-pause-button"
            onClick={onToggleTimer}
            title={isActive ? 'Pause' : 'Start Focus'}
            aria-label={isActive ? 'Pause timer' : 'Start focus timer'}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-[#010101] lg:text-white transition-all duration-200 cursor-pointer shadow-sm hover:scale-105 active:scale-95"
          >
            {isActive ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current ml-0.5" />
            )}
          </button>
        </div>
      </div>

      {/* Bottom Session Info and Quick Controls */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-[#010101] lg:text-white">
            {sessionLabel}
          </span>
          <button
            type="button"
            id="timer-skip-button"
            onClick={onSkipSession}
            title="Skip to next session"
            className="text-xs text-[#010101]/60 lg:text-white/60 hover:text-[#010101] lg:hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>Skip</span>
            <SkipForward className="w-3 h-3" />
          </button>
        </div>

        <p className="text-sm leading-relaxed text-[#010101]/70 lg:text-white/70">
          {sessionDetail}
        </p>

        {/* Subtle quick mode switch buttons */}
        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/10 text-[11px]">
          <button
            type="button"
            id="session-switch-focus"
            onClick={() => onSwitchSessionType('focus')}
            className={`transition-colors cursor-pointer ${
              sessionType === 'focus'
                ? 'font-semibold text-[#010101] lg:text-white underline underline-offset-4'
                : 'text-[#010101]/60 lg:text-white/60 hover:text-[#010101] lg:hover:text-white'
            }`}
          >
            Focus
          </button>
          <span className="text-[#010101]/30 lg:text-white/30">·</span>
          <button
            type="button"
            id="session-switch-short"
            onClick={() => onSwitchSessionType('shortBreak')}
            className={`transition-colors cursor-pointer ${
              sessionType === 'shortBreak'
                ? 'font-semibold text-[#010101] lg:text-white underline underline-offset-4'
                : 'text-[#010101]/60 lg:text-white/60 hover:text-[#010101] lg:hover:text-white'
            }`}
          >
            Short Break
          </button>
          <span className="text-[#010101]/30 lg:text-white/30">·</span>
          <button
            type="button"
            id="session-switch-long"
            onClick={() => onSwitchSessionType('longBreak')}
            className={`transition-colors cursor-pointer ${
              sessionType === 'longBreak'
                ? 'font-semibold text-[#010101] lg:text-white underline underline-offset-4'
                : 'text-[#010101]/60 lg:text-white/60 hover:text-[#010101] lg:hover:text-white'
            }`}
          >
            Long Break
          </button>
        </div>
      </div>
    </div>
  );
};
