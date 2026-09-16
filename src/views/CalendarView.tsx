import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  Clock,
  BookOpen,
  CheckCircle2,
  X,
  AlertCircle,
} from 'lucide-react';
import { CalendarItem, CalendarEventType, Task, PomodoroSession } from '../types';

interface CalendarViewProps {
  calendarItems: CalendarItem[];
  tasks: Task[];
  sessions: PomodoroSession[];
  onAddCalendarItem: (item: Omit<CalendarItem, 'id'>) => void;
  onDeleteCalendarItem: (id: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  calendarItems,
  tasks,
  sessions,
  onAddCalendarItem,
  onDeleteCalendarItem,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New item form
  const [title, setTitle] = useState('');
  const [type, setType] = useState<CalendarEventType>('exam');
  const [time, setTime] = useState('10:00 AM');
  const [subject, setSubject] = useState('Mathematics');
  const [notes, setNotes] = useState('');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const prevMonthDays = new Date(year, month, 0).getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today.toISOString().slice(0, 10));
  };

  // Days array
  const calendarDays = [];
  // previous month padding
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const d = prevMonthDays - i;
    const dateStr = new Date(year, month - 1, d).toISOString().slice(0, 10);
    calendarDays.push({ day: d, dateStr, isCurrentMonth: false });
  }
  // current month
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    calendarDays.push({ day: d, dateStr, isCurrentMonth: true });
  }
  // next month padding to make full grid of 35 or 42
  const totalSlots = calendarDays.length <= 35 ? 35 : 42;
  const remaining = totalSlots - calendarDays.length;
  for (let d = 1; d <= remaining; d++) {
    const dateStr = new Date(year, month + 1, d).toISOString().slice(0, 10);
    calendarDays.push({ day: d, dateStr, isCurrentMonth: false });
  }

  // Selected date details
  const selectedEvents = calendarItems.filter((item) => item.date === selectedDate);
  const selectedTasks = tasks.filter((t) => t.dueDate === selectedDate);

  // Sessions on selected date
  const selStart = new Date(`${selectedDate}T00:00:00`).getTime();
  const selEnd = new Date(`${selectedDate}T23:59:59`).getTime();
  const selectedSessions = sessions.filter((s) => s.timestamp >= selStart && s.timestamp <= selEnd);
  const selectedFocusMinutes = selectedSessions.reduce((acc, s) => acc + s.durationMinutes, 0);

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddCalendarItem({
      title: title.trim(),
      type,
      date: selectedDate,
      time: time.trim() || undefined,
      subject,
      notes: notes.trim() || undefined,
    });

    setTitle('');
    setNotes('');
    setIsAddModalOpen(false);
  };

  const getEventTypeColor = (t: CalendarEventType) => {
    switch (t) {
      case 'exam':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      case 'assignment':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'study':
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
      case 'task':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      default:
        return 'bg-white/10 text-white border-white/20';
    }
  };

  return (
    <div id="calendar-view" className="p-4 sm:p-8 max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-white">Study Calendar</h2>
          <p className="text-xs sm:text-sm text-white/60 mt-1">
            Map out exams, project deadlines, and focused study blocks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={goToToday}
            className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-white border border-white/10 transition-colors cursor-pointer"
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            style={{ background: 'linear-gradient(to bottom, #2B2B2B, #101010)' }}
            className="px-4 py-1.5 rounded-xl text-xs font-semibold text-white border border-white/20 flex items-center gap-1.5 hover:opacity-90 transition-opacity cursor-pointer shadow-md"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Event</span>
          </button>
        </div>
      </div>

      {/* Grid + Schedule Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Calendar Grid (8 cols) */}
        <div className="lg:col-span-8 p-5 sm:p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between">
          {/* Month Navigator */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-white">
              {monthNames[month]} {year}
            </h3>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={prevMonth}
                aria-label="Previous month"
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={nextMonth}
                aria-label="Next month"
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekday Labels */}
          <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-white/40 uppercase tracking-wider py-2 border-b border-white/5">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 mt-2">
            {calendarDays.map((dObj, idx) => {
              const isSelected = dObj.dateStr === selectedDate;
              const isToday = dObj.dateStr === new Date().toISOString().slice(0, 10);
              const dayEvents = calendarItems.filter((i) => i.date === dObj.dateStr);
              const dayTasks = tasks.filter((t) => t.dueDate === dObj.dateStr);

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedDate(dObj.dateStr)}
                  className={`min-h-[70px] sm:min-h-[85px] p-1.5 rounded-xl border flex flex-col items-start justify-between transition-all text-left cursor-pointer ${
                    isSelected
                      ? 'bg-white/15 border-white/30 text-white shadow-md'
                      : dObj.isCurrentMonth
                      ? 'bg-white/[0.02] hover:bg-white/[0.05] border-white/5 text-white/90'
                      : 'bg-transparent border-transparent text-white/20'
                  }`}
                >
                  <div className="w-full flex items-center justify-between">
                    <span
                      className={`text-xs font-medium w-5 h-5 flex items-center justify-center rounded-full ${
                        isToday ? 'bg-white text-black font-bold' : ''
                      }`}
                    >
                      {dObj.day}
                    </span>
                    {(dayEvents.length > 0 || dayTasks.length > 0) && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    )}
                  </div>

                  {/* Tiny Badges */}
                  <div className="w-full space-y-0.5 overflow-hidden">
                    {dayEvents.slice(0, 2).map((ev) => (
                      <div
                        key={ev.id}
                        className={`text-[9px] px-1 py-0.2 rounded truncate border ${getEventTypeColor(
                          ev.type
                        )}`}
                      >
                        {ev.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <span className="text-[9px] text-white/50 block pl-1">
                        +{dayEvents.length - 2} more
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Day Schedule Details (4 cols) */}
        <div className="lg:col-span-4 p-5 sm:p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <div>
                <span className="text-xs uppercase tracking-widest text-white/50 font-semibold block">
                  SCHEDULE FOR
                </span>
                <h4 className="text-base font-semibold text-white">
                  {new Date(`${selectedDate}T12:00:00`).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })}
                </h4>
              </div>

              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Add event on this date"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Metrics for the Day */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <span className="text-[10px] text-white/50 block mb-0.5">Focus Logged</span>
                <span className="text-sm font-bold text-white">
                  {selectedFocusMinutes > 0 ? `${selectedFocusMinutes}m` : '0m'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <span className="text-[10px] text-white/50 block mb-0.5">Due Tasks</span>
                <span className="text-sm font-bold text-white">{selectedTasks.length}</span>
              </div>
            </div>

            {/* Events on this Day */}
            <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
              <span className="text-[10px] uppercase font-semibold tracking-wider text-white/40 block">
                Scheduled Items ({selectedEvents.length})
              </span>

              {selectedEvents.length > 0 ? (
                selectedEvents.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-white/[0.04] border border-white/10 group flex flex-col justify-between gap-1"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded-md font-semibold uppercase border ${getEventTypeColor(
                            item.type
                          )}`}
                        >
                          {item.type}
                        </span>
                        <h5 className="text-xs font-semibold text-white mt-1">{item.title}</h5>
                      </div>
                      <button
                        type="button"
                        onClick={() => onDeleteCalendarItem(item.id)}
                        className="opacity-0 group-hover:opacity-100 text-white/40 hover:text-rose-400 transition-opacity cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-white/50 mt-1">
                      {item.time && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{item.time}</span>
                        </span>
                      )}
                      {item.subject && <span>· {item.subject}</span>}
                    </div>

                    {item.notes && (
                      <p className="text-[11px] text-white/60 mt-1 italic">{item.notes}</p>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-xs text-white/40 py-4 text-center">
                  {calendarItems.length === 0
                    ? 'No study events scheduled yet.'
                    : 'No scheduled exams or deadlines on this date.'}
                </div>
              )}

              {/* Tasks due today */}
              {selectedTasks.length > 0 && (
                <div className="pt-2">
                  <span className="text-[10px] uppercase font-semibold tracking-wider text-white/40 block mb-2">
                    Tasks Due ({selectedTasks.length})
                  </span>
                  {selectedTasks.map((t) => (
                    <div
                      key={t.id}
                      className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5 text-xs text-white/80 flex items-center justify-between mb-1.5"
                    >
                      <span className="truncate">{t.title}</span>
                      <span className="text-[10px] text-white/50">{t.subject}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="w-full mt-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-white/80 hover:text-white border border-white/10 transition-colors cursor-pointer text-center"
          >
            + Add Event to {selectedDate}
          </button>
        </div>
      </div>

      {/* Add Calendar Item Modal */}
      {isAddModalOpen && (
        <div
          id="calendar-add-modal-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div
            id="calendar-add-modal-card"
            className="w-full max-w-md rounded-2xl bg-[#111111] border border-white/15 shadow-2xl p-6 sm:p-8 text-white"
          >
            <h3 className="text-xl font-semibold tracking-tight text-white mb-1">
              Schedule Calendar Event
            </h3>
            <p className="text-xs text-white/50 mb-6">
              Track deadlines, study sessions, or exam dates.
            </p>

            <form onSubmit={handleCreateItem} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Midterm Physics Exam"
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-xs text-white placeholder-white/40 focus:outline-none"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1">Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as CalendarEventType)}
                    className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="exam" className="bg-[#1a1a1a]">Exam</option>
                    <option value="assignment" className="bg-[#1a1a1a]">Assignment</option>
                    <option value="study" className="bg-[#1a1a1a]">Study Session</option>
                    <option value="task" className="bg-[#1a1a1a]">Task</option>
                    <option value="event" className="bg-[#1a1a1a]">Event</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1">Subject</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Mathematics"
                    className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1">Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1">Time</label>
                  <input
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="e.g. 10:00 AM"
                    className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">Notes / Location</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Optional room number, covered chapters, or instructions..."
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-xs text-white placeholder-white/40 focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-white/70 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ background: 'linear-gradient(to bottom, #2B2B2B, #101010)' }}
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-white border border-white/20 hover:opacity-90 transition-opacity cursor-pointer shadow-md"
                >
                  Add Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
