import React from 'react';
import {
  Menu,
  Timer,
  Headphones,
  Sparkles,
  CalendarCheck,
  User,
} from 'lucide-react';
import { AppPage, UserProfile } from '../types';

interface TopBarProps {
  activePage: AppPage;
  onToggleMobileNav: () => void;
  onNavigateToFocus: () => void;
  onOpenProfile: () => void;
  onOpenReplay: () => void;
  isTimerRunning: boolean;
  timerSecondsLeft: number;
  activeSoundName: string | null;
  onToggleSound: () => void;
  profile: UserProfile;
}

export const TopBar: React.FC<TopBarProps> = ({
  activePage,
  onToggleMobileNav,
  onNavigateToFocus,
  onOpenProfile,
  onOpenReplay,
  isTimerRunning,
  timerSecondsLeft,
  activeSoundName,
  onToggleSound,
  profile,
}) => {
  const pageTitles: Record<AppPage, string> = {
    overview: 'Overview',
    focus: 'Focus Timer',
    tasks: 'Tasks & Syllabus',
    calendar: 'Study Calendar',
    analytics: 'Analytics & Insights',
    progress: 'Progress & Mastery',
    garden: 'Focus Garden',
    notes: 'Study Notebook',
    sounds: 'Ambient Sounds',
    challenges: 'Weekly Challenges',
    settings: 'Settings',
  };

  const minutes = Math.floor(timerSecondsLeft / 60);
  const seconds = timerSecondsLeft % 60;
  const formattedTimer = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <header
      id="app-topbar"
      className="h-16 px-4 sm:px-8 border-b border-white/10 bg-[#0a0a0a]/90 backdrop-blur-xl flex items-center justify-between sticky top-0 z-30"
    >
      {/* Left: Mobile hamburger & Active Page Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleMobileNav}
          className="lg:hidden p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 transition-colors cursor-pointer"
          aria-label="Open sidebar menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-white capitalize">
          {pageTitles[activePage] || 'Dashboard'}
        </h1>
      </div>

      {/* Right: Quick actions (Mini Timer, Sound indicator, Focus Replay, Profile) */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Active Ambient Sound Badge */}
        {activeSoundName && (
          <button
            type="button"
            onClick={onToggleSound}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 text-xs text-indigo-300 transition-colors cursor-pointer"
            title={`Playing ${activeSoundName}. Click to toggle.`}
          >
            <Headphones className="w-3.5 h-3.5 animate-pulse" />
            <span className="capitalize hidden sm:inline">{activeSoundName}</span>
          </button>
        )}

        {/* Mini Active Timer Badge (jump directly to focus) */}
        {isTimerRunning && (
          <button
            type="button"
            onClick={onNavigateToFocus}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/20 border border-white/20 text-xs text-white transition-all cursor-pointer shadow-sm"
            title="Focus timer running. Click to view."
          >
            <Timer className="w-3.5 h-3.5 text-orange-400 animate-spin" style={{ animationDuration: '4s' }} />
            <span style={{ fontFamily: "'Silkscreen', cursive" }} className="tabular-nums">
              {formattedTimer}
            </span>
          </button>
        )}

        {/* Daily Focus Replay button */}
        <button
          type="button"
          onClick={onOpenReplay}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white/80 hover:text-white transition-colors cursor-pointer"
          title="Daily Focus Replay summary"
        >
          <CalendarCheck className="w-3.5 h-3.5 text-white/70" />
          <span>Daily Replay</span>
        </button>

        {/* User Profile avatar & level */}
        <button
          type="button"
          id="topbar-user-profile-button"
          onClick={onOpenProfile}
          className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white transition-colors cursor-pointer"
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-neutral-700 to-neutral-500 flex items-center justify-center text-white font-semibold text-xs border border-white/20">
            {profile.name.charAt(0) || <User className="w-3.5 h-3.5" />}
          </div>
          <div className="text-left hidden md:block">
            <span className="block font-medium text-white leading-tight truncate max-w-[90px]">
              {profile.name}
            </span>
            <span className="block text-[10px] text-white/50 leading-none">
              Lvl {profile.level}
            </span>
          </div>
        </button>
      </div>
    </header>
  );
};
