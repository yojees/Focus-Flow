import React, { useState } from 'react';
import {
  Plus,
  Play,
  CheckCircle2,
  Trash2,
  ArrowUp,
  ArrowDown,
  Calendar,
  Timer,
  Search,
  Filter,
  AlertCircle,
} from 'lucide-react';
import { Task, Priority, TaskGroup } from '../types';

interface TasksViewProps {
  tasks: Task[];
  onAddTask: (task: Omit<Task, 'id' | 'createdAt' | 'order' | 'completedPomodoros'>) => void;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onMoveTask: (taskId: string, direction: 'up' | 'down') => void;
  onStartFocus: (task: Task) => void;
}

export const TasksView: React.FC<TasksViewProps> = ({
  tasks,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onMoveTask,
  onStartFocus,
}) => {
  const [activeTab, setActiveTab] = useState<'today' | 'upcoming' | 'completed' | 'all'>('today');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New task form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('Programming');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [estimatedPomodoros, setEstimatedPomodoros] = useState(2);
  const [group, setGroup] = useState<TaskGroup>('today');

  const subjectsList = ['All', 'Programming', 'Mathematics', 'Physics', 'Psychology', 'Literature', 'History', 'Other'];

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTask({
      title: title.trim(),
      description: description.trim() || undefined,
      subject,
      priority,
      completed: false,
      group,
      dueDate,
      estimatedPomodoros,
    });

    setTitle('');
    setDescription('');
    setIsAddModalOpen(false);
  };

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    // Tab filter
    if (activeTab === 'today' && (task.group !== 'today' || task.completed)) return false;
    if (activeTab === 'upcoming' && (task.group !== 'upcoming' || task.completed)) return false;
    if (activeTab === 'completed' && !task.completed) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = task.title.toLowerCase().includes(q);
      const matchSubj = task.subject.toLowerCase().includes(q);
      const matchDesc = task.description?.toLowerCase().includes(q);
      if (!matchTitle && !matchSubj && !matchDesc) return false;
    }

    // Subject filter
    if (selectedSubjectFilter !== 'all' && task.subject !== selectedSubjectFilter) {
      return false;
    }

    return true;
  });

  return (
    <div id="tasks-view" className="p-4 sm:p-8 max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-white">Coursework & Tasks</h2>
          <p className="text-xs sm:text-sm text-white/60 mt-1">
            Organize assignments, syllabus readings, and estimated focus intervals.
          </p>
        </div>

        <button
          type="button"
          id="tasks-add-new-button"
          onClick={() => setIsAddModalOpen(true)}
          style={{ background: 'linear-gradient(to bottom, #2B2B2B, #101010)' }}
          className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white border border-white/20 flex items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer shadow-md self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Task</span>
        </button>
      </div>

      {/* Tabs & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        {/* View Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10 w-fit">
          <button
            type="button"
            onClick={() => setActiveTab('today')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'today' ? 'bg-white/15 text-white' : 'text-white/60 hover:text-white'
            }`}
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('upcoming')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'upcoming' ? 'bg-white/15 text-white' : 'text-white/60 hover:text-white'
            }`}
          >
            Upcoming
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('completed')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'completed' ? 'bg-white/15 text-white' : 'text-white/60 hover:text-white'
            }`}
          >
            Completed
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'all' ? 'bg-white/15 text-white' : 'text-white/60 hover:text-white'
            }`}
          >
            All Tasks
          </button>
        </div>

        {/* Search & Subject Dropdown */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..."
              className="pl-8 pr-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-white/40 focus:outline-none focus:border-white/30 w-36 sm:w-48"
            />
          </div>

          <select
            value={selectedSubjectFilter}
            onChange={(e) => setSelectedSubjectFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white/80 focus:outline-none focus:border-white/30"
          >
            {subjectsList.map((s) => (
              <option key={s} value={s === 'All' ? 'all' : s} className="bg-[#1a1a1a] text-white">
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task, idx) => (
            <div
              key={task.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                task.completed
                  ? 'bg-white/[0.04] border-white/5 opacity-60 backdrop-blur-md'
                  : 'bg-white/10 hover:bg-white/15 backdrop-blur-lg border-white/10 shadow-sm'
              }`}
            >
              {/* Left: Checkbox + Title + Description + Meta */}
              <div className="flex items-start gap-3.5 min-w-0 flex-1">
                <button
                  type="button"
                  onClick={() => onToggleTask(task.id)}
                  className={`w-5 h-5 rounded-md border mt-0.5 flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                    task.completed
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-400'
                      : 'border-white/30 hover:border-white text-transparent'
                  }`}
                  aria-label="Toggle task completion"
                >
                  <CheckCircle2 className="w-4 h-4" />
                </button>

                <div className="min-w-0 flex-1">
                  <h3
                    className={`text-sm font-semibold text-white tracking-tight ${
                      task.completed ? 'line-through text-white/50' : ''
                    }`}
                  >
                    {task.title}
                  </h3>

                  {task.description && (
                    <p className="text-xs text-white/60 mt-1 leading-relaxed line-clamp-2">
                      {task.description}
                    </p>
                  )}

                  {/* Metadata Chips: Subject, Priority, Due Date, Pomodoro Estimate */}
                  <div className="flex flex-wrap items-center gap-2 mt-2 text-[11px]">
                    {/* Subject */}
                    <span className="px-2 py-0.5 rounded-md bg-white/10 text-white/80 font-medium">
                      {task.subject}
                    </span>

                    {/* Priority */}
                    <span
                      className={`px-2 py-0.5 rounded-md font-medium capitalize border ${
                        task.priority === 'high'
                          ? 'bg-rose-500/10 text-rose-300 border-rose-500/20'
                          : task.priority === 'medium'
                          ? 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                          : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                      }`}
                    >
                      {task.priority}
                    </span>

                    {/* Due Date */}
                    {task.dueDate && (
                      <span className="flex items-center gap-1 text-white/50">
                        <Calendar className="w-3 h-3" />
                        <span>Due {task.dueDate}</span>
                      </span>
                    )}

                    {/* Pomodoros */}
                    <span className="flex items-center gap-1 text-white/50 font-mono">
                      <Timer className="w-3 h-3 text-orange-400" />
                      <span>
                        {task.completedPomodoros}/{task.estimatedPomodoros} 🍅
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Actions (Focus, Reorder, Delete) */}
              <div className="flex items-center gap-1.5 sm:self-center shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-white/5 justify-end">
                {!task.completed && (
                  <button
                    type="button"
                    onClick={() => onStartFocus(task)}
                    className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white flex items-center gap-1.5 transition-colors cursor-pointer border border-white/10 mr-1"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Focus</span>
                  </button>
                )}

                {/* Reorder buttons */}
                <button
                  type="button"
                  onClick={() => onMoveTask(task.id, 'up')}
                  disabled={idx === 0}
                  className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white disabled:opacity-20 flex items-center justify-center transition-colors cursor-pointer"
                  title="Move up"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onMoveTask(task.id, 'down')}
                  disabled={idx === filteredTasks.length - 1}
                  className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white disabled:opacity-20 flex items-center justify-center transition-colors cursor-pointer"
                  title="Move down"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>

                {/* Delete */}
                <button
                  type="button"
                  onClick={() => onDeleteTask(task.id)}
                  className="w-7 h-7 rounded-lg bg-white/5 hover:bg-rose-500/20 text-white/60 hover:text-rose-300 flex items-center justify-center transition-colors cursor-pointer ml-1"
                  title="Delete task"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 rounded-2xl bg-white/[0.02] border border-white/5 text-center">
            <p className="text-sm text-white/50">
              {tasks.length === 0
                ? 'No tasks yet. Add your first task to start organizing your study session.'
                : 'No tasks found for this view.'}
            </p>
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="mt-3 text-xs text-white underline underline-offset-4 hover:text-white/80 cursor-pointer"
            >
              Add your first task
            </button>
          </div>
        )}
      </div>

      {/* Add Task Modal */}
      {isAddModalOpen && (
        <div
          id="add-task-modal-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div
            id="add-task-modal-card"
            className="w-full max-w-lg rounded-2xl bg-[#111111] border border-white/15 shadow-2xl p-6 sm:p-8 text-white max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-xl font-semibold tracking-tight text-white mb-1">
              Add New Coursework Task
            </h3>
            <p className="text-xs text-white/50 mb-6">
              Estimate your focus intervals to schedule Pomodoro blocks.
            </p>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Solve Physics Problem Set 4"
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-white/30"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">Description / Notes</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional details, textbook page numbers, or requirements..."
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-white/30 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1">Subject</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    {subjectsList.filter((s) => s !== 'All').map((s) => (
                      <option key={s} value={s} className="bg-[#1a1a1a] text-white">
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Priority)}
                    className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="high" className="bg-[#1a1a1a] text-white">High Priority</option>
                    <option value="medium" className="bg-[#1a1a1a] text-white">Medium Priority</option>
                    <option value="low" className="bg-[#1a1a1a] text-white">Low Priority</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1">Est. Pomodoros</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={estimatedPomodoros}
                    onChange={(e) => setEstimatedPomodoros(Number(e.target.value) || 1)}
                    className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1">Bucket</label>
                  <select
                    value={group}
                    onChange={(e) => setGroup(e.target.value as TaskGroup)}
                    className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="today" className="bg-[#1a1a1a] text-white">Today</option>
                    <option value="upcoming" className="bg-[#1a1a1a] text-white">Upcoming</option>
                  </select>
                </div>
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
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
