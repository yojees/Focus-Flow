import React from 'react';
import {
  LayoutDashboard,
  Timer,
  CheckSquare,
  Calendar,
  BarChart3,
  Sparkles,
  TreePine,
  FileText,
  Headphones,
  Trophy,
  Settings,
  ArrowLeft,
  Flame,
} from 'lucide-react';
import { AppPage } from '../types';

interface SidebarProps {
  activePage: AppPage;
  onNavigate: (page: AppPage) => void;
  onReturnToLanding: () => void;
  streakDays: number;
  isMobileNavOpen: boolean;
  setIsMobileNavOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  onNavigate,
  onReturnToLanding,
  streakDays,
  isMobileNavOpen,
  setIsMobileNavOpen,
}) => {
  const navItems: { id: AppPage; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'focus', label: 'Focus', icon: Timer },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'progress', label: 'Progress', icon: Sparkles },
    { id: 'garden', label: 'Focus Garden', icon: TreePine },
    { id: 'notes', label: 'Notes', icon: FileText },
    { id: 'sounds', label: 'Sounds', icon: Headphones },
    { id: 'challenges', label: 'Challenges', icon: Trophy },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isMobileNavOpen && (
        <div
          id="mobile-sidebar-backdrop"
          onClick={() => setIsMobileNavOpen(false)}
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        id="app-sidebar"
        className={`fixed lg:static top-0 left-0 z-50 h-full w-64 bg-[#0a0a0a] border-r border-white/10 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isMobileNavOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Logo and Streak */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              onNavigate('overview');
              setIsMobileNavOpen(false);
            }}
            className="flex items-center gap-2.5 text-left focus:outline-none group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center border border-white/15 group-hover:bg-white/15 transition-colors">
              <Timer className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-base font-semibold tracking-tight text-white block">
                FocusFlow
              </span>
              <span className="text-[11px] text-white/50 block font-normal">
                Student Workspace
              </span>
            </div>
          </button>

          <div
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-orange-400 font-medium"
            title={`${streakDays} day study streak`}
          >
            <Flame className="w-3.5 h-3.5 fill-orange-400" />
            <span>{streakDays}d</span>
          </div>
        </div>

        {/* Navigation links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => {
                  onNavigate(item.id);
                  setIsMobileNavOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-white/15 text-white shadow-sm border border-white/15'
                    : 'text-white/70 hover:bg-white/5 hover:text-white border border-transparent'
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? 'text-white' : 'text-white/50 group-hover:text-white'
                  }`}
                />
                <span className="truncate">{item.label}</span>
                {item.id === 'garden' && (
                  <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-normal">
                    New
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom actions: Return to landing & creator credit */}
        <div className="p-4 border-t border-white/10 flex flex-col gap-2 bg-white/[0.01]">
          <button
            type="button"
            onClick={() => {
              setIsMobileNavOpen(false);
              onReturnToLanding();
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-white/60 hover:text-white hover:bg-white/5 border border-white/5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>View Landing Page</span>
          </button>
          <div className="text-[11px] text-white/40 text-center pt-1">
            FocusFlow · Created by Yojees R
          </div>
        </div>
      </aside>
    </>
  );
};
