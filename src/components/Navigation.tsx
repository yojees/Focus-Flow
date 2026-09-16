import React, { useEffect } from 'react';
import { Clock, Menu, X } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  onGetStarted: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onSelectTab,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  onGetStarted,
}) => {
  const navLinks = [
    { id: 'focus', label: 'Focus' },
    { id: 'tasks', label: 'Tasks' },
    { id: 'progress', label: 'Progress' },
    { id: 'about', label: 'About' },
  ];

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  return (
    <header className="w-full z-30 flex items-center justify-between px-5 py-5 sm:px-8 sm:py-6 lg:px-12">
      {/* Brand Logo */}
      <button
        type="button"
        id="focusflow-logo-button"
        onClick={() => onSelectTab('focus')}
        className="flex items-center gap-2 text-left cursor-pointer transition-opacity hover:opacity-90 focus:outline-none"
      >
        <Clock className="w-6 h-6 text-[#010101] lg:text-white shrink-0" />
        <span className="text-lg font-semibold tracking-tight text-[#010101] lg:text-white">
          FocusFlow
        </span>
      </button>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-3">
        {/* Glass pill navigation */}
        <nav
          id="desktop-nav-pill"
          className="flex items-center gap-1 rounded-full bg-white/10 px-1.5 py-1.5 backdrop-blur-lg border border-white/10"
        >
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                id={`desktop-nav-link-${link.id}`}
                onClick={() => onSelectTab(link.id)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-white/15 text-white'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Separate Get started pill */}
        <button
          type="button"
          id="desktop-get-started-cta"
          onClick={onGetStarted}
          style={{ background: 'linear-gradient(to bottom, #2B2B2B, #101010)' }}
          className="rounded-full px-5 py-2 text-sm font-medium text-white self-stretch flex items-center justify-center transition-opacity hover:opacity-90 cursor-pointer shadow-sm border border-white/10"
        >
          Get started
        </button>
      </div>

      {/* Mobile Hamburger Button */}
      <button
        type="button"
        id="mobile-menu-toggle-button"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
        className="md:hidden z-50 relative flex items-center justify-center h-10 w-10 rounded-full bg-white/10 backdrop-blur-lg border border-white/10 cursor-pointer text-[#010101] lg:text-white"
      >
        <Menu
          className={`w-5 h-5 absolute transition-all duration-300 ${
            isMobileMenuOpen ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
          }`}
        />
        <X
          className={`w-5 h-5 absolute transition-all duration-300 ${
            isMobileMenuOpen ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
          }`}
        />
      </button>

      {/* Mobile Menu Backdrop */}
      <div
        id="mobile-menu-backdrop"
        onClick={() => setIsMobileMenuOpen(false)}
        className={`fixed inset-0 z-40 bg-black/80 backdrop-blur-md transition-opacity duration-300 md:hidden ${
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Mobile Drawer */}
      <div
        id="mobile-menu-drawer"
        className={`fixed right-0 top-0 z-40 h-full w-72 bg-black/90 backdrop-blur-xl border-l border-white/10 flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col px-6 pt-24 gap-2">
          {navLinks.map((link, index) => (
            <button
              key={link.id}
              id={`mobile-nav-link-${link.id}`}
              onClick={() => {
                onSelectTab(link.id);
                setIsMobileMenuOpen(false);
              }}
              style={{
                transitionDelay: isMobileMenuOpen ? `${(index + 1) * 60}ms` : '0ms',
                transform: isMobileMenuOpen ? 'translateX(0)' : 'translateX(24px)',
                opacity: isMobileMenuOpen ? 1 : 0,
              }}
              className={`text-left rounded-xl px-4 py-3.5 text-base font-medium transition-all duration-300 cursor-pointer ${
                activeTab === link.id
                  ? 'bg-white/15 text-white'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Bottom CTA in mobile drawer */}
        <div
          className="mt-auto px-6 pb-10 transition-all duration-400"
          style={{
            transitionDelay: isMobileMenuOpen ? '300ms' : '0ms',
            transform: isMobileMenuOpen ? 'translateY(0)' : 'translateY(16px)',
            opacity: isMobileMenuOpen ? 1 : 0,
          }}
        >
          <button
            type="button"
            id="mobile-drawer-start-focusing-btn"
            onClick={() => {
              setIsMobileMenuOpen(false);
              onGetStarted();
            }}
            style={{ background: 'linear-gradient(to bottom, #2B2B2B, #101010)' }}
            className="w-full py-3.5 rounded-full text-sm font-medium text-white border border-white/10 transition-opacity hover:opacity-90 cursor-pointer shadow-lg"
          >
            Start focusing
          </button>
        </div>
      </div>
    </header>
  );
};
