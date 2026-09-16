import React, { useState } from 'react';
import {
  Settings,
  Timer,
  Moon,
  Volume2,
  Database,
  Download,
  Upload,
  RotateCcw,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { AppSettings, UserProfile } from '../types';

interface SettingsViewProps {
  settings: AppSettings;
  profile: UserProfile;
  onUpdateSettings: (newSettings: AppSettings) => void;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
  onExportData: () => void;
  onImportData: (jsonStr: string) => void;
  onResetData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  profile,
  onUpdateSettings,
  onUpdateProfile,
  onExportData,
  onImportData,
  onResetData,
}) => {
  const [focusDur, setFocusDur] = useState(settings.focusDuration);
  const [shortDur, setShortDur] = useState(settings.shortBreakDuration);
  const [longDur, setLongDur] = useState(settings.longBreakDuration);
  const [autoBreaks, setAutoBreaks] = useState(settings.autoStartBreaks);
  const [autoPomodoros, setAutoPomodoros] = useState(settings.autoStartPomodoros);
  const [timerSound, setTimerSound] = useState(settings.timerSound);

  const [studentName, setStudentName] = useState(profile.name);
  const [primaryFocus, setPrimaryFocus] = useState(profile.primaryFocus);
  const [savedFeedback, setSavedFeedback] = useState(false);

  const handleSaveTimer = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      ...settings,
      focusDuration: focusDur,
      shortBreakDuration: shortDur,
      longBreakDuration: longDur,
      autoStartBreaks: autoBreaks,
      autoStartPomodoros: autoPomodoros,
      timerSound,
    });
    onUpdateProfile({
      name: studentName.trim() || 'Student',
      primaryFocus,
    });
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2000);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = ev.target?.result as string;
      if (content) {
        onImportData(content);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div id="settings-view" className="p-4 sm:p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-white">App Settings & Preferences</h2>
        <p className="text-xs sm:text-sm text-white/60 mt-1">
          Customize your Pomodoro cycles, student profile, and local data persistence.
        </p>
      </div>

      <form onSubmit={handleSaveTimer} className="space-y-6">
        {/* Profile Details */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider text-white/70">
            Student Profile
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-white/60 mb-1.5">
                Your Name
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full rounded-xl bg-white/5 border border-white/10 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-white/30"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/60 mb-1.5">
                Major / Field of Study
              </label>
              <input
                type="text"
                value={primaryFocus}
                onChange={(e) => setPrimaryFocus(e.target.value)}
                className="w-full rounded-xl bg-white/5 border border-white/10 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-white/30"
              />
            </div>
          </div>
        </div>

        {/* Timer Customization */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider text-white/70 flex items-center gap-2">
            <Timer className="w-4 h-4 text-white/60" />
            <span>Pomodoro Interval Durations (Minutes)</span>
          </h3>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-white/60 mb-1">Focus Duration</label>
              <input
                type="number"
                min="1"
                max="180"
                value={focusDur}
                onChange={(e) => setFocusDur(Number(e.target.value) || 25)}
                className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-xs text-white text-center"
              />
            </div>

            <div>
              <label className="block text-xs text-white/60 mb-1">Short Break</label>
              <input
                type="number"
                min="1"
                max="60"
                value={shortDur}
                onChange={(e) => setShortDur(Number(e.target.value) || 5)}
                className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-xs text-white text-center"
              />
            </div>

            <div>
              <label className="block text-xs text-white/60 mb-1">Long Break</label>
              <input
                type="number"
                min="1"
                max="60"
                value={longDur}
                onChange={(e) => setLongDur(Number(e.target.value) || 15)}
                className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-xs text-white text-center"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-white/5 space-y-3">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs text-white/80">Auto-start Breaks after Focus</span>
              <input
                type="checkbox"
                checked={autoBreaks}
                onChange={(e) => setAutoBreaks(e.target.checked)}
                className="w-4 h-4 rounded accent-white cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs text-white/80">Auto-start Pomodoros after Break</span>
              <input
                type="checkbox"
                checked={autoPomodoros}
                onChange={(e) => setAutoPomodoros(e.target.checked)}
                className="w-4 h-4 rounded accent-white cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs text-white/80">Completion Bell Sound</span>
              <input
                type="checkbox"
                checked={timerSound}
                onChange={(e) => setTimerSound(e.target.checked)}
                className="w-4 h-4 rounded accent-white cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Save button */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-emerald-400 font-medium">
            {savedFeedback && '✓ Preferences saved successfully!'}
          </span>

          <button
            type="submit"
            style={{ background: 'linear-gradient(to bottom, #2B2B2B, #101010)' }}
            className="px-6 py-2.5 rounded-xl text-xs font-semibold text-white border border-white/20 hover:opacity-90 transition-opacity cursor-pointer shadow-md"
          >
            Save Changes
          </button>
        </div>
      </form>

      {/* Data Management Section */}
      <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider text-white/70 flex items-center gap-2">
          <Database className="w-4 h-4 text-white/60" />
          <span>Local Storage & Backup</span>
        </h3>
        <p className="text-xs text-white/50">
          All your coursework, notes, and session logs reside safely in your browser. You can export a JSON backup anytime or restore.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onExportData}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-medium text-white flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Data (JSON)</span>
          </button>

          <label className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-medium text-white flex items-center gap-2 transition-colors cursor-pointer">
            <Upload className="w-3.5 h-3.5" />
            <span>Import Data</span>
            <input
              type="file"
              accept=".json"
              onChange={handleFileImport}
              className="hidden"
            />
          </label>

          <button
            type="button"
            onClick={onResetData}
            className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-xs font-medium text-rose-300 flex items-center gap-2 transition-colors cursor-pointer ml-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Workspace</span>
          </button>
        </div>
      </div>
    </div>
  );
};
