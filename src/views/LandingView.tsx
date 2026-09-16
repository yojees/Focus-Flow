import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Clock,
  Menu,
  X,
  ChevronDown,
  ArrowRight,
  Timer,
  CheckSquare,
  Calendar,
  BarChart3,
  Zap,
  TreePine,
  FileText,
  Headphones,
  Trophy,
  Target,
  ShieldAlert,
  RotateCcw,
} from 'lucide-react';

interface LandingViewProps {
  onEnterApp: (name?: string) => void;
  streakDays: number;
  initialName?: string;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onEnterApp,
  initialName = '',
}) => {
  const [name, setName] = useState(initialName);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('home');

  // Handle body scroll locking when mobile menu drawer is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMobileMenuOpen]);

  // Observe active section on scroll
  useEffect(() => {
    const sectionIds = ['home', 'features', 'how-it-works', 'about'];

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, {
      root: null,
      rootMargin: '-35% 0px -45% 0px',
      threshold: 0,
    });

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setValidationError('Please enter your name to continue.');
      return;
    }
    setValidationError(null);
    onEnterApp(trimmed);
  };

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleGetStartedNav = () => {
    setIsMobileMenuOpen(false);
    const input = document.getElementById('user-name-input');
    if (input) {
      input.focus();
      input.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      scrollToSection('home');
    }
  };

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'features', label: 'Features' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'about', label: 'About' },
  ];

  const featuresList = [
    {
      icon: Timer,
      title: 'Focus Timer',
      description:
        'Customizable Pomodoro blocks (25/5, 50/10, 90/20) with distraction logging and procedural soundscapes.',
    },
    {
      icon: CheckSquare,
      title: 'Tasks',
      description:
        'Structured assignment lists with Pomodoro estimates, priority weights, and completion status.',
    },
    {
      icon: Calendar,
      title: 'Calendar',
      description:
        'Academic schedule and deadline planner for exams, problem sets, and semester milestones.',
    },
    {
      icon: BarChart3,
      title: 'Analytics',
      description:
        'Transparent telemetry on daily study time, subject allocation, and consistency heatmaps.',
    },
    {
      icon: Zap,
      title: 'Progress',
      description:
        'Compounding XP engine, level rank advancement, streak counters, and earned discipline accolades.',
    },
    {
      icon: TreePine,
      title: 'Focus Garden',
      description:
        'Cultivate a personal digital biome that flourishes as you complete genuine focus sessions.',
    },
    {
      icon: FileText,
      title: 'Notes',
      description:
        'Distraction-free scratchpads and lecture notebooks organized by course subjects.',
    },
    {
      icon: Headphones,
      title: 'Focus Sounds',
      description:
        'Procedural offline soundscapes including rain, ocean, forest, cafe, and binaural waves.',
    },
    {
      icon: Trophy,
      title: 'Challenges',
      description:
        'Weekly discipline milestones crafted to cultivate sustainable, long-term study habits.',
    },
    {
      icon: Target,
      title: 'Daily Goals',
      description:
        'Set realistic daily focus targets and measure your actual progress without intrusive notifications.',
    },
    {
      icon: ShieldAlert,
      title: 'Distraction Tracker',
      description:
        'Log digital and mental interruptions post-session to build cognitive stamina and self-awareness.',
    },
    {
      icon: RotateCcw,
      title: 'Focus Replay',
      description:
        'Daily retrospectives summarizing completed work and tomorrow\'s study priorities.',
    },
  ];

  const stepsList = [
    {
      step: '01',
      action: 'Create',
      text: 'Create the task you actually want to work on.',
      subtext: 'Define clear, achievable assignments and estimate needed Pomodoros.',
    },
    {
      step: '02',
      action: 'Focus',
      text: 'Start a focus session and work without distractions.',
      subtext: 'Immerse in single-task work supported by procedural ambient audio.',
    },
    {
      step: '03',
      action: 'Track',
      text: 'FocusFlow records your actual activity.',
      subtext: 'Every completed minute and task reliably updates your daily telemetry.',
    },
    {
      step: '04',
      action: 'Improve',
      text: 'Use your own data to understand your progress.',
      subtext: 'Discover your peak study hours and build durable academic discipline.',
    },
  ];

  return (
    <div
      id="landing-page"
      className="relative w-full min-h-screen bg-[#09090b] text-white selection:bg-white/20 selection:text-white font-sans"
    >
      {/* Fixed Cinematic Background Video (pointer-events-none ensures scroll events pass straight to document) */}
      <video
        id="hero-background-video"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260803_192301_9231ed6b-c55c-4a48-909c-4ebe11cf2e11.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 h-full w-full object-cover z-0 pointer-events-none opacity-40"
      />

      {/* Dark gradient overlay for guaranteed legibility and contrast */}
      <div className="fixed inset-0 bg-gradient-to-b from-black/40 via-black/70 to-[#09090b] z-0 pointer-events-none" />

      {/* Fixed Navbar (stays at top during normal scrolling) */}
      <header
        id="landing-header"
        className="fixed top-0 left-0 right-0 z-50 w-full flex items-center justify-between px-5 py-4 sm:px-8 sm:py-5 lg:px-12 backdrop-blur-md bg-black/30 border-b border-white/5 transition-colors"
      >
        {/* Logo */}
        <div
          onClick={() => scrollToSection('home')}
          className="flex items-center gap-2 cursor-pointer group select-none"
        >
          <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:scale-105 transition-transform" />
          <span className="text-base sm:text-lg font-semibold tracking-tight text-white">
            FocusFlow
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-3">
          <nav
            id="landing-desktop-nav-pill"
            className="flex items-center gap-1 rounded-full bg-white/10 px-1.5 py-1.5 backdrop-blur-lg border border-white/10"
          >
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => scrollToSection(link.id)}
                  className={`rounded-full px-4 py-1.5 text-xs lg:text-sm transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-white/20 text-white font-semibold shadow-xs'
                      : 'text-white/70 hover:bg-white/5 hover:text-white font-medium'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          <button
            type="button"
            id="landing-nav-cta"
            onClick={handleGetStartedNav}
            style={{ background: 'linear-gradient(to bottom, #2B2B2B, #101010)' }}
            className="rounded-full px-5 py-2 text-xs lg:text-sm font-medium text-white self-stretch flex items-center justify-center transition-opacity hover:opacity-90 cursor-pointer shadow-sm border border-white/15"
          >
            Get Started
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          id="landing-mobile-menu-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          className="md:hidden z-50 relative flex items-center justify-center h-11 w-11 rounded-full bg-white/10 backdrop-blur-lg border border-white/10 cursor-pointer text-white"
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

        {/* Mobile Backdrop & Drawer */}
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className={`fixed inset-0 z-40 bg-black/80 backdrop-blur-md transition-opacity duration-300 md:hidden ${
            isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        />

        <div
          className={`fixed right-0 top-0 z-40 h-full w-72 bg-[#111111]/95 backdrop-blur-xl border-l border-white/10 flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:hidden ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex flex-col px-6 pt-24 gap-2">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className={`text-left rounded-xl px-4 py-3.5 text-base transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white/15 text-white font-semibold'
                      : 'text-white/70 hover:bg-white/5 hover:text-white font-medium'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </div>

          <div className="mt-auto px-6 pb-10">
            <button
              type="button"
              onClick={handleGetStartedNav}
              style={{ background: 'linear-gradient(to bottom, #2B2B2B, #101010)' }}
              className="w-full py-3.5 rounded-full text-sm font-medium text-white border border-white/15 transition-opacity hover:opacity-90 cursor-pointer shadow-lg"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container (relative z-10, no overflow hidden, scrolls normally) */}
      <div className="relative z-10 w-full">
        {/* ============================================================ */}
        {/* SECTION 1 — HERO (min-h-screen) */}
        {/* ============================================================ */}
        <section
          id="home"
          className="min-h-screen w-full flex flex-col justify-between px-5 sm:px-8 lg:px-12 pt-28 pb-10"
        >
          <div className="max-w-3xl flex flex-col my-auto">
            {/* Tagline / Brand badge */}
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-xs uppercase tracking-widest text-white/50 font-semibold mb-4 block"
            >
              FocusFlow
            </motion.span>

            {/* Main Heading */}
            <motion.h1
              id="hero-headline"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-6xl lg:text-7xl font-semibold leading-[1.08] tracking-tight text-white"
            >
              Focus smarter. Get more done.
            </motion.h1>

            {/* Directly Underneath: Created by Yojees R */}
            <motion.p
              id="hero-created-by"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-3 text-sm sm:text-base font-medium text-white/60"
            >
              Created by Yojees R
            </motion.p>

            {/* Functional Name Input and Get Started Button */}
            <motion.form
              onSubmit={handleSubmit}
              id="landing-name-form"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 max-w-md w-full"
            >
              <input
                type="text"
                id="user-name-input"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (validationError) setValidationError(null);
                }}
                placeholder="Enter your name"
                autoComplete="name"
                className="flex-1 rounded-full bg-white/10 backdrop-blur-md px-5 py-3.5 text-sm text-white placeholder-white/40 border border-white/15 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40 transition-all shadow-sm"
              />
              <button
                type="submit"
                id="hero-get-started-btn"
                style={{ background: 'linear-gradient(to bottom, #2B2B2B, #101010)' }}
                className="rounded-full px-7 py-3.5 text-sm font-medium text-white transition-opacity hover:opacity-90 cursor-pointer text-center shrink-0 border border-white/15 shadow-md flex items-center justify-center gap-2"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.form>

            {/* Subtle Validation Message */}
            {validationError && (
              <p
                id="name-validation-message"
                className="mt-2.5 text-xs text-rose-300 font-medium animate-in fade-in"
              >
                {validationError}
              </p>
            )}
          </div>

          {/* Scroll Indicator: Clicking smoothly scrolls to Features */}
          <div className="flex justify-center pt-8">
            <button
              type="button"
              id="scroll-to-explore-btn"
              onClick={() => {
                document.getElementById('features')?.scrollIntoView({
                  behavior: 'smooth',
                });
              }}
              className="flex flex-col items-center gap-2 text-white/40 hover:text-white/80 transition-colors cursor-pointer group focus:outline-none"
              aria-label="Scroll to explore features"
            >
              <span className="text-xs font-medium tracking-wide">Scroll to explore</span>
              <motion.div
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <ChevronDown className="w-4 h-4 text-white/50 group-hover:text-white transition-colors" />
              </motion.div>
            </button>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION 2 — FEATURES (min-h-screen) */}
        {/* ============================================================ */}
        <section
          id="features"
          className="min-h-screen w-full py-24 sm:py-32 px-5 sm:px-8 lg:px-12 border-t border-white/5 bg-black/40 backdrop-blur-md flex flex-col justify-center"
        >
          <div className="max-w-6xl mx-auto w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5 }}
              className="mb-16"
            >
              <span className="text-xs uppercase tracking-widest text-white/50 font-semibold block mb-2">
                CAPABILITIES
              </span>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
                Everything you need to focus.
              </h2>
              <p className="text-sm sm:text-base text-white/60 mt-2 max-w-2xl leading-relaxed">
                Build your own workflow, stay focused, and track the progress you actually make.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {featuresList.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.45, delay: (idx % 3) * 0.08 }}
                    className="p-6 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-white mb-4 group-hover:scale-105 transition-transform">
                        <Icon className="w-5 h-5 text-white/90" />
                      </div>
                      <h3 className="text-base font-semibold text-white mb-2">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION 3 — HOW IT WORKS (min-h-screen) */}
        {/* ============================================================ */}
        <section
          id="how-it-works"
          className="min-h-screen w-full py-24 sm:py-32 px-5 sm:px-8 lg:px-12 border-t border-white/5 bg-[#09090b]/80 backdrop-blur-md flex flex-col justify-center"
        >
          <div className="max-w-6xl mx-auto w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5 }}
              className="mb-16"
            >
              <span className="text-xs uppercase tracking-widest text-white/50 font-semibold block mb-2">
                METHODOLOGY
              </span>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
                How FocusFlow works.
              </h2>
              <p className="text-sm sm:text-base text-white/60 mt-2 max-w-xl leading-relaxed">
                A simple visual flow to replace study procrastination with calm, consistent execution.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {stepsList.map((st, idx) => (
                <motion.div
                  key={st.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col justify-between hover:border-white/20 transition-all"
                >
                  <div>
                    <span
                      style={{ fontFamily: "'Silkscreen', cursive" }}
                      className="text-2xl sm:text-3xl text-white/35 font-normal block mb-4"
                    >
                      {st.step}
                    </span>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {st.action}
                    </h3>
                    <p className="text-sm font-medium text-white/90 mb-2 leading-snug">
                      {st.text}
                    </p>
                    <p className="text-xs text-white/50 leading-relaxed">
                      {st.subtext}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION 4 — ABOUT (min-h-screen) */}
        {/* ============================================================ */}
        <section
          id="about"
          className="min-h-screen w-full py-24 sm:py-32 px-5 sm:px-8 lg:px-12 border-t border-white/5 bg-black/60 backdrop-blur-md flex flex-col justify-center"
        >
          <div className="max-w-4xl mx-auto text-center flex flex-col items-center w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center w-full"
            >
              <span className="text-xs uppercase tracking-widest text-white/50 font-semibold mb-3">
                ABOUT FOCUSFLOW
              </span>

              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white mb-6">
                Built for focused work.
              </h2>

              <p className="text-lg sm:text-xl lg:text-2xl font-normal leading-relaxed text-white/90 max-w-3xl">
                FocusFlow is a personal productivity workspace designed to help students organize what they need to do, focus on it, and understand their progress over time.
              </p>

              <p
                id="about-created-by"
                className="mt-6 text-sm font-medium text-white/60"
              >
                Created by Yojees R
              </p>

              <div className="mt-12">
                <button
                  type="button"
                  onClick={handleGetStartedNav}
                  style={{ background: 'linear-gradient(to bottom, #2B2B2B, #101010)' }}
                  className="rounded-full px-8 py-3.5 text-sm font-medium text-white transition-opacity hover:opacity-90 cursor-pointer border border-white/15 shadow-lg flex items-center gap-2"
                >
                  <span>Get Started with FocusFlow</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* FOOTER / FINAL CTA */}
        {/* ============================================================ */}
        <footer className="py-8 px-5 sm:px-8 lg:px-12 border-t border-white/5 text-xs text-white/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-white/60" />
            <span className="font-semibold text-white/80">FocusFlow</span>
            <span>· Created by Yojees R</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => scrollToSection('home')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('features')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Features
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('how-it-works')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              How It Works
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('about')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              About
            </button>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Back to Top ↑
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};
