import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  BookOpen,
  CheckSquare,
  Sparkles,
  Edit3,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { Task, SessionType, AppSettings } from '../types';
import { playChime } from '../utils/audio';

interface FocusViewProps {
  tasks: Task[];
  activeTask: Task | null;
  onSelectActiveTask: (task: Task | null) => void;
  onSessionComplete: (sessionData: {
    durationMinutes: number;
    type: SessionType;
    subject: string;
    taskTitle?: string;
    taskId?: string;
  }) => void;
  onOpenQuickNotes: () => void;
  settings: AppSettings;
}

export const FocusView: React.FC<FocusViewProps> = ({
  tasks,
  activeTask,
  onSelectActiveTask,
  onSessionComplete,
  onOpenQuickNotes,
  settings,
}) => {
  const [mode, setMode] = useState<SessionType>('focus');
  const [selectedPreset, setSelectedPreset] = useState<'25_5' | '50_10' | '90_20' | 'custom'>('25_5');
  const [customFocusMinutes, setCustomFocusMinutes] = useState(25);
  const [customBreakMinutes, setCustomBreakMinutes] = useState(5);

  const [sessionCount, setSessionCount] = useState(1);
  const totalSessionsCycle = 4;

  const [subject, setSubject] = useState(activeTask ? activeTask.subject : 'General Study');
  const [customTaskName, setCustomTaskName] = useState(activeTask ? activeTask.title : '');

  // Timer duration in seconds based on mode & preset
  const getDurationSeconds = (sessionMode: SessionType) => {
    if (sessionMode === 'focus') {
      if (selectedPreset === '25_5') return 25 * 60;
      if (selectedPreset === '50_10') return 50 * 60;
      if (selectedPreset === '90_20') return 90 * 60;
      return customFocusMinutes * 60;
    }
    if (sessionMode === 'shortBreak') {
      if (selectedPreset === '25_5') return 5 * 60;
      if (selectedPreset === '50_10') return 10 * 60;
      if (selectedPreset === '90_20') return 20 * 60;
      return customBreakMinutes * 60;
    }
    // longBreak
    return settings.longBreakDuration * 60 || 15 * 60;
  };

  const [secondsLeft, setSecondsLeft] = useState(() => getDurationSeconds(mode));
  const [isRunning, setIsRunning] = useState(false);
  const [soundMuted, setSoundMuted] = useState(!settings.timerSound);

  // Sync with activeTask if changed outside
  useEffect(() => {
    if (activeTask) {
      setSubject(activeTask.subject);
      setCustomTaskName(activeTask.title);
    }
  }, [activeTask]);

  // Handle Preset Change
  const applyPreset = (preset: '25_5' | '50_10' | '90_20' | 'custom') => {
    setSelectedPreset(preset);
    setIsRunning(false);
    if (preset === '25_5') {
      setSecondsLeft(mode === 'focus' ? 25 * 60 : 5 * 60);
    } else if (preset === '50_10') {
      setSecondsLeft(mode === 'focus' ? 50 * 60 : 10 * 60);
    } else if (preset === '90_20') {
      setSecondsLeft(mode === 'focus' ? 90 * 60 : 20 * 60);
    } else {
      setSecondsLeft(mode === 'focus' ? customFocusMinutes * 60 : customBreakMinutes * 60);
    }
  };

  // Switch Mode
  const switchMode = (newMode: SessionType) => {
    setMode(newMode);
    setIsRunning(false);
    setSecondsLeft(getDurationSeconds(newMode));
  };

  // Timer Tick
  useEffect(() => {
    let timer: number | null = null;
    if (isRunning) {
      timer = window.setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            handleComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, mode, sessionCount]);

  const handleComplete = () => {
    setIsRunning(false);

    if (!soundMuted) {
      playChime('bell');
    }

    const duration = Math.round(getDurationSeconds(mode) / 60);
    if (mode === 'focus') {
      onSessionComplete({
        durationMinutes: duration,
        type: 'focus',
        subject: subject || 'General Study',
        taskTitle: customTaskName || activeTask?.title || undefined,
        taskId: activeTask?.id,
      });

      // Advance session cycle
      const nextSession = sessionCount >= totalSessionsCycle ? 1 : sessionCount + 1;
      setSessionCount(nextSession);

      // Auto-switch to break
      if (nextSession === 1) {
        setMode('longBreak');
        setSecondsLeft(settings.longBreakDuration * 60);
      } else {
        setMode('shortBreak');
        setSecondsLeft(selectedPreset === '50_10' ? 10 * 60 : selectedPreset === '90_20' ? 20 * 60 : 5 * 60);
      }
      if (settings.autoStartBreaks) {
        setIsRunning(true);
      }
    } else {
      // Break completed -> switch back to focus
      setMode('focus');
      setSecondsLeft(getDurationSeconds('focus'));
      if (settings.autoStartPomodoros) {
        setIsRunning(true);
      }
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setSecondsLeft(getDurationSeconds(mode));
  };

  const handleSkip = () => {
    setIsRunning(false);
    if (mode === 'focus') {
      switchMode('shortBreak');
    } else {
      switchMode('focus');
    }
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const currentDuration = getDurationSeconds(mode);
  const progressPercent = Math.min(100, Math.max(0, ((currentDuration - secondsLeft) / currentDuration) * 100));

  const subjectsList = ['Programming', 'Mathematics', 'Physics', 'Psychology', 'Literature', 'History', 'Design'];

  return (
    <div id="focus-studio" className="p-4 sm:p-8 max-w-4xl mx-auto flex flex-col items-center space-y-8 animate-in fade-in duration-300">
      {/* Mode Pills: Focus (25m), Short Break (5m), Long Break (15m) */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-lg">
        <button
          type="button"
          onClick={() => switchMode('focus')}
          className={`px-5 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
            mode === 'focus'
              ? 'bg-white/15 text-white shadow-sm border border-white/20'
              : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'
          }`}
        >
          Focus
        </button>
        <button
          type="button"
          onClick={() => switchMode('shortBreak')}
          className={`px-5 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
            mode === 'shortBreak'
              ? 'bg-white/15 text-white shadow-sm border border-white/20'
              : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'
          }`}
        >
          Short Break
        </button>
        <button
          type="button"
          onClick={() => switchMode('longBreak')}
          className={`px-5 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
            mode === 'longBreak'
              ? 'bg-white/15 text-white shadow-sm border border-white/20'
              : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'
          }`}
        >
          Long Break
        </button>
      </div>

      {/* Main Focus Centerpiece */}
      <div className="w-full max-w-xl p-8 sm:p-12 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/10 shadow-2xl flex flex-col items-center relative overflow-hidden text-center">
        {/* Subtle radial background glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />

        {/* Cycle & Sound Mute Toggle */}
        <div className="w-full flex items-center justify-between text-xs text-white/50 mb-6 z-10">
          <span className="font-medium tracking-wide">
            Session {sessionCount} of {totalSessionsCycle}
          </span>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onOpenQuickNotes}
              className="flex items-center gap-1 text-white/70 hover:text-white transition-colors cursor-pointer"
              title="Open Quick Notes Scratchpad"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Quick Notes</span>
            </button>
            <button
              type="button"
              onClick={() => setSoundMuted(!soundMuted)}
              className="text-white/60 hover:text-white transition-colors cursor-pointer"
              title={soundMuted ? 'Unmute chime' : 'Mute chime'}
            >
              {soundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Main Countdown Display using EXACT Silkscreen Font */}
        <div className="my-6 select-none z-10">
          <div
            id="focus-main-timer-display"
            style={{ fontFamily: "'Silkscreen', cursive", fontWeight: 'normal' }}
            className="text-6xl sm:text-8xl tracking-tight text-white tabular-nums drop-shadow-sm"
          >
            {formattedTime}
          </div>

          <p className="text-sm font-medium text-white/70 mt-3 capitalize">
            {mode === 'focus' ? 'Deep Focus Immersion' : mode === 'shortBreak' ? 'Short Rest Interval' : 'Extended Rest Period'}
          </p>
        </div>

        {/* Progress bar line */}
        <div className="w-full max-w-sm h-1.5 rounded-full bg-white/10 overflow-hidden mb-8 z-10">
          <div
            className="h-full rounded-full bg-white transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Controls: Start / Pause / Resume / Reset / Skip */}
        <div className="flex items-center gap-3 sm:gap-4 z-10">
          <button
            type="button"
            onClick={handleReset}
            title="Reset timer"
            className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            type="button"
            id="focus-primary-toggle-btn"
            onClick={() => setIsRunning(!isRunning)}
            style={{ background: 'linear-gradient(to bottom, #2B2B2B, #101010)' }}
            className="px-8 py-3.5 rounded-2xl text-base font-semibold text-white border border-white/20 flex items-center gap-2.5 hover:opacity-90 transition-all cursor-pointer shadow-xl min-w-[150px] justify-center"
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current ml-0.5" />
                <span>{secondsLeft < getDurationSeconds(mode) ? 'Resume' : 'Start'}</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleSkip}
            title="Skip to next session"
            className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Timer Presets Bar: 25/5, 50/10, 90/20, Custom */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <span className="text-xs text-white/40 mr-2 uppercase tracking-wider font-semibold">
          Presets:
        </span>
        <button
          type="button"
          onClick={() => applyPreset('25_5')}
          className={`px-4 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
            selectedPreset === '25_5'
              ? 'bg-white/15 border-white/30 text-white'
              : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
          }`}
        >
          25 / 5 min
        </button>
        <button
          type="button"
          onClick={() => applyPreset('50_10')}
          className={`px-4 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
            selectedPreset === '50_10'
              ? 'bg-white/15 border-white/30 text-white'
              : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
          }`}
        >
          50 / 10 min
        </button>
        <button
          type="button"
          onClick={() => applyPreset('90_20')}
          className={`px-4 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
            selectedPreset === '90_20'
              ? 'bg-white/15 border-white/30 text-white'
              : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
          }`}
        >
          90 / 20 min
        </button>
        <button
          type="button"
          onClick={() => applyPreset('custom')}
          className={`px-4 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
            selectedPreset === 'custom'
              ? 'bg-white/15 border-white/30 text-white'
              : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
          }`}
        >
          Custom
        </button>
      </div>

      {/* Custom Duration Inputs (if selected) */}
      {selectedPreset === 'custom' && (
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-white/60">Focus (min):</span>
            <input
              type="number"
              min="1"
              max="180"
              value={customFocusMinutes}
              onChange={(e) => {
                const val = Number(e.target.value) || 25;
                setCustomFocusMinutes(val);
                if (mode === 'focus' && !isRunning) setSecondsLeft(val * 60);
              }}
              className="w-16 rounded-lg bg-white/10 border border-white/10 px-2 py-1 text-white text-center"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white/60">Break (min):</span>
            <input
              type="number"
              min="1"
              max="60"
              value={customBreakMinutes}
              onChange={(e) => {
                const val = Number(e.target.value) || 5;
                setCustomBreakMinutes(val);
                if (mode === 'shortBreak' && !isRunning) setSecondsLeft(val * 60);
              }}
              className="w-16 rounded-lg bg-white/10 border border-white/10 px-2 py-1 text-white text-center"
            />
          </div>
        </div>
      )}

      {/* Session Details: Subject & Task Target Selection */}
      <div className="w-full max-w-xl p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
        <h4 className="text-xs font-semibold text-white/70 uppercase tracking-wider flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-white/60" />
          <span>Active Task & Subject</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Subject Picker */}
          <div>
            <label className="block text-[11px] text-white/50 mb-1.5">Subject</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-xs text-white focus:outline-none focus:border-white/30"
            >
              {subjectsList.map((s) => (
                <option key={s} value={s} className="bg-[#1a1a1a] text-white">
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Pick from tasks or enter custom */}
          <div>
            <label className="block text-[11px] text-white/50 mb-1.5">Assigned Task</label>
            <select
              value={activeTask ? activeTask.id : 'custom'}
              onChange={(e) => {
                const id = e.target.value;
                if (id === 'custom') {
                  onSelectActiveTask(null);
                } else {
                  const found = tasks.find((t) => t.id === id);
                  if (found) onSelectActiveTask(found);
                }
              }}
              className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-xs text-white focus:outline-none focus:border-white/30 truncate"
            >
              <option value="custom" className="bg-[#1a1a1a] text-white">
                Enter Custom Goal...
              </option>
              {tasks
                .filter((t) => !t.completed)
                .map((t) => (
                  <option key={t.id} value={t.id} className="bg-[#1a1a1a] text-white truncate">
                    {t.title} ({t.subject})
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Custom Task Goal Input (if no preset selected) */}
        {!activeTask && (
          <div>
            <input
              type="text"
              value={customTaskName}
              onChange={(e) => setCustomTaskName(e.target.value)}
              placeholder="e.g. Finish JavaScript assignment or Chapter 4 review..."
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-white/30"
            />
          </div>
        )}
      </div>
    </div>
  );
};
