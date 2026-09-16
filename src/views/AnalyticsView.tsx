import React, { useState } from 'react';
import {
  BarChart3,
  Calendar,
  Clock,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  ShieldAlert,
  Flame,
  PieChart,
} from 'lucide-react';
import { PomodoroSession, Task, DistractionEntry } from '../types';

interface AnalyticsViewProps {
  sessions: PomodoroSession[];
  tasks: Task[];
  distractions: DistractionEntry[];
  streakDays: number;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  sessions,
  tasks,
  distractions,
  streakDays,
}) => {
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('week');

  // Filter sessions based on range
  const now = new Date();
  const dayMs = 86400000;
  const cutoff =
    timeRange === 'day'
      ? now.getTime() - dayMs
      : timeRange === 'week'
      ? now.getTime() - dayMs * 7
      : now.getTime() - dayMs * 30;

  const relevantSessions = sessions.filter((s) => s.timestamp >= cutoff);
  const totalFocusMinutes = relevantSessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const totalSessionsCount = relevantSessions.length;
  const avgSession = totalSessionsCount > 0 ? Math.round(totalFocusMinutes / totalSessionsCount) : 0;

  const hours = Math.floor(totalFocusMinutes / 60);
  const mins = totalFocusMinutes % 60;
  const formattedFocusTime = `${hours}h ${mins}m`;

  const completedTasksCount = tasks.filter((t) => t.completed).length;

  // Group focus time by subject
  const subjectMap: Record<string, number> = {};
  relevantSessions.forEach((s) => {
    subjectMap[s.subject] = (subjectMap[s.subject] || 0) + s.durationMinutes;
  });

  // Find top subject
  let topSubjectName = 'None';
  let topSubjectMinutes = 0;
  Object.entries(subjectMap).forEach(([name, count]) => {
    if (count > topSubjectMinutes) {
      topSubjectMinutes = count;
      topSubjectName = name;
    }
  });

  // Actual last 7 days focus chart data
  const daysOfWeek: string[] = [];
  const dayValues: number[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    const dayStart = d.getTime();
    const dayEnd = dayStart + 86400000;
    const daySessions = sessions.filter((s) => s.timestamp >= dayStart && s.timestamp < dayEnd);
    const dayTotal = daySessions.reduce((acc, s) => acc + s.durationMinutes, 0);
    dayValues.push(dayTotal);
    daysOfWeek.push(d.toLocaleDateString([], { weekday: 'short' }));
  }
  const maxDayVal = Math.max(...dayValues, 60);

  // Distraction breakdown
  const distractionCounts: Record<string, number> = {};
  distractions.forEach((d) => {
    if (d.reason && d.reason !== 'None') {
      distractionCounts[d.reason] = (distractionCounts[d.reason] || 0) + 1;
    }
  });

  const totalDistractions = Object.values(distractionCounts).reduce((a, b) => a + b, 0);
  let topDistraction = 'None';
  let topDistractionCount = 0;
  Object.entries(distractionCounts).forEach(([name, c]) => {
    if (c > topDistractionCount) {
      topDistractionCount = c;
      topDistraction = name;
    }
  });
  const distractionPercent = totalDistractions > 0 ? Math.round((topDistractionCount / totalDistractions) * 100) : 0;

  // Peak study day calculation
  const maxDayMinutes = Math.max(...dayValues);
  const peakDayIdx = dayValues.indexOf(maxDayMinutes);
  const peakDayName = maxDayMinutes > 0 ? daysOfWeek[peakDayIdx] : null;

  // Real 28-day heatmap calculation
  const heatmapDays = Array.from({ length: 28 }).map((_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (27 - i));
    const start = d.getTime();
    const end = start + 86400000;
    const count = sessions.filter((s) => s.timestamp >= start && s.timestamp < end).length;
    return { date: d.toLocaleDateString([], { month: 'short', day: 'numeric' }), count };
  });

  return (
    <div id="analytics-view" className="p-4 sm:p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Top Header & Range Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-white">Study Analytics</h2>
          <p className="text-xs sm:text-sm text-white/60 mt-1">
            Measurable telemetry on study duration, task throughput, and concentration patterns.
          </p>
        </div>

        {/* Range Selector */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setTimeRange('day')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              timeRange === 'day' ? 'bg-white/15 text-white' : 'text-white/60 hover:text-white'
            }`}
          >
            Day
          </button>
          <button
            type="button"
            onClick={() => setTimeRange('week')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              timeRange === 'week' ? 'bg-white/15 text-white' : 'text-white/60 hover:text-white'
            }`}
          >
            Week
          </button>
          <button
            type="button"
            onClick={() => setTimeRange('month')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              timeRange === 'month' ? 'bg-white/15 text-white' : 'text-white/60 hover:text-white'
            }`}
          >
            Month
          </button>
        </div>
      </div>

      {/* Empty State Banner if no sessions yet */}
      {sessions.length === 0 && (
        <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center text-xs sm:text-sm text-white/60">
          No focus history available yet. Complete your first focus session to see productivity insights.
        </div>
      )}

      {/* 4 Metric Headline Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Focus Time */}
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-white/50">
            <span>Focus Time</span>
            <Clock className="w-4 h-4 text-white/60" />
          </div>
          <div className="mt-4">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {formattedFocusTime}
            </span>
            <span className="text-[11px] text-white/40 block mt-1">Logged study time</span>
          </div>
        </div>

        {/* Sessions */}
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-white/50">
            <span>Sessions Completed</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-4">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {totalSessionsCount}
            </span>
            <span className="text-[11px] text-white/40 block mt-1">Pomodoro blocks</span>
          </div>
        </div>

        {/* Tasks completed */}
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-white/50">
            <span>Tasks Finished</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-4">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {completedTasksCount}
            </span>
            <span className="text-[11px] text-white/40 block mt-1">Assignments cleared</span>
          </div>
        </div>

        {/* Average Session */}
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-white/50">
            <span>Average Session</span>
            <TrendingUp className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-4">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {avgSession}m
            </span>
            <span className="text-[11px] text-white/40 block mt-1">Duration average</span>
          </div>
        </div>
      </div>

      {/* Visual Charts Grid: Daily Focus Bars & Subject Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Focus Time by Day (7 cols) */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-semibold text-white">Focus Time by Day</h3>
              <p className="text-xs text-white/50">Minutes spent in deep study across the past 7 days</p>
            </div>
            <span className="text-xs text-white/50 font-mono">Min / Day</span>
          </div>

          {/* Bar Chart Visualization */}
          <div className="h-48 w-full flex items-end justify-between gap-2 sm:gap-4 pt-6 border-b border-white/10 pb-2">
            {daysOfWeek.map((day, idx) => {
              const val = dayValues[idx];
              const heightPercent = maxDayVal > 0 ? Math.min(100, Math.round((val / maxDayVal) * 100)) : 0;
              const isPeak = val > 0 && val === maxDayMinutes;

              return (
                <div key={`${day}-${idx}`} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[10px] text-white/40 opacity-0 group-hover:opacity-100 transition-opacity">
                    {val}m
                  </span>
                  <div className="w-full max-w-[36px] bg-white/10 rounded-t-lg h-36 flex items-end overflow-hidden">
                    <div
                      className={`w-full rounded-t-lg transition-all duration-500 ${
                        isPeak ? 'bg-white' : 'bg-white/40 hover:bg-white/60'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-medium text-white/60">{day}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-white/50">
            <span>
              {peakDayName
                ? `Peak study intensity recorded on ${peakDayName} (${maxDayMinutes} min).`
                : 'No daily focus recorded yet.'}
            </span>
            <span className="font-semibold text-white">Daily Target: 120m</span>
          </div>
        </div>

        {/* Focus Time by Subject (5 cols) */}
        <div className="lg:col-span-5 p-6 sm:p-8 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-white">Focus by Subject</h3>
            <p className="text-xs text-white/50">Distribution of learning effort</p>
          </div>

          <div className="space-y-4 my-2">
            {Object.keys(subjectMap).length > 0 ? (
              Object.entries(subjectMap).map(([subj, mins]) => {
                const pct = Math.round((mins / (totalFocusMinutes || 1)) * 100);
                const hrs = (mins / 60).toFixed(1);

                return (
                  <div key={subj} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-white">{subj}</span>
                      <span className="text-white/60">{hrs}h ({pct}%)</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-white transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-8 text-center text-xs text-white/40">
                No subject focus recorded yet.
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-white/5 text-xs text-white/60 flex items-center justify-between">
            <span>Total logged subjects:</span>
            <span className="text-white font-semibold">{Object.keys(subjectMap).length} subjects</span>
          </div>
        </div>
      </div>

      {/* Special Sections: Most Focused Subject, Productivity Patterns, Distraction Report */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Most Focused Subject */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between">
          <div>
            <span className="text-xs uppercase tracking-widest text-white/50 font-semibold block mb-1">
              MOST FOCUSED SUBJECT
            </span>
            <h4 className="text-lg font-bold text-white mt-2">
              {topSubjectMinutes > 0 ? topSubjectName : 'No subject yet'}
            </h4>
            <p className="text-sm font-semibold text-white/80 mt-1">
              {Math.floor(topSubjectMinutes / 60)}h {topSubjectMinutes % 60}m logged
            </p>
          </div>
          <p className="text-xs text-white/50 mt-4 leading-relaxed">
            {topSubjectMinutes > 0
              ? `Primary concentration allocated to ${topSubjectName}.`
              : 'Complete study sessions to discover your primary subject focus.'}
          </p>
        </div>

        {/* Productivity Patterns */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between">
          <div>
            <span className="text-xs uppercase tracking-widest text-white/50 font-semibold block mb-1">
              PRODUCTIVITY PATTERNS
            </span>
            <h4 className="text-base font-semibold text-white mt-2">
              {peakDayName ? `Most active on ${peakDayName}.` : 'No study pattern yet.'}
            </h4>
            <p className="text-xs text-white/60 mt-1">
              {sessions.length > 0
                ? 'Consistency data actively tracks your focus rhythms.'
                : 'Patterns will calculate automatically as sessions are logged.'}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 mt-4 text-[11px] text-white/70">
            💡 Recommendation: Set recurring morning study blocks for peak stamina.
          </div>
        </div>

        {/* Distraction Report */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between">
          <div>
            <span className="text-xs uppercase tracking-widest text-white/50 font-semibold block mb-1">
              DISTRACTION REPORT
            </span>
            <div className="flex items-center gap-2 mt-2">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              <h4 className="text-base font-semibold text-white">
                {totalDistractions > 0
                  ? `${topDistraction} — ${distractionPercent}%`
                  : 'Zero Distractions'}
              </h4>
            </div>
            <p className="text-xs text-white/50 mt-1">
              {totalDistractions > 0
                ? 'Recorded across focus reflections.'
                : 'No distractions recorded. Great discipline!'}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 mt-4 text-[11px] text-white/70">
            📵 Tip: Place your smartphone face down or activate Focus Mode while studying.
          </div>
        </div>
      </div>

      {/* Study Consistency Heatmap */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white/5 border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-white">Study Consistency Heatmap</h3>
            <p className="text-xs text-white/50">Consecutive activity squares for the past 4 weeks</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-orange-400 font-semibold">
            <Flame className="w-4 h-4 fill-orange-400" />
            <span>{streakDays} Day Active Streak</span>
          </div>
        </div>

        {/* 28-day square grid */}
        <div className="grid grid-cols-7 sm:grid-cols-14 gap-2 pt-2">
          {heatmapDays.map((item, i) => {
            const opacityClass =
              item.count >= 4
                ? 'bg-white'
                : item.count >= 2
                ? 'bg-white/60'
                : item.count === 1
                ? 'bg-white/30'
                : 'bg-white/[0.05] border border-white/5';

            return (
              <div
                key={i}
                title={`${item.date}: ${item.count} session${item.count === 1 ? '' : 's'}`}
                className={`h-7 rounded-lg ${opacityClass} transition-transform hover:scale-110 cursor-pointer`}
              />
            );
          })}
        </div>

        <div className="flex items-center justify-between text-[11px] text-white/40 mt-4">
          <span>4 weeks ago</span>
          <div className="flex items-center gap-2">
            <span>Less</span>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-white/10 inline-block" />
              <span className="w-3 h-3 rounded bg-white/30 inline-block" />
              <span className="w-3 h-3 rounded bg-white/60 inline-block" />
              <span className="w-3 h-3 rounded bg-white inline-block" />
            </div>
            <span>More</span>
          </div>
          <span>Today</span>
        </div>
      </div>
    </div>
  );
};
