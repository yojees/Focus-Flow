import React, { useState } from 'react';
import { X, Plus, Trash2, Check, Tag, ChevronDown } from 'lucide-react';
import { Task } from '../types';
import { playChime } from '../utils/audio';

interface TasksModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

export const TasksModal: React.FC<TasksModalProps> = ({
  isOpen,
  onClose,
  tasks,
  onAddTask,
  onToggleTask,
  onDeleteTask,
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [subject, setSubject] = useState('General');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [group, setGroup] = useState<'today' | 'upcoming'>('today');
  const [filterGroup, setFilterGroup] = useState<'all' | 'today' | 'upcoming'>('today');

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddTask({
      title: newTitle.trim(),
      subject: subject.trim() || 'General',
      priority,
      group,
      completed: false,
    });
    setNewTitle('');
    playChime('click');
  };

  const filteredTasks = tasks.filter((t) => {
    if (filterGroup === 'all') return true;
    return t.group === filterGroup;
  });

  const todayTasks = tasks.filter((t) => t.group === 'today');
  const completedToday = todayTasks.filter((t) => t.completed).length;

  return (
    <div
      id="tasks-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        id="tasks-modal-container"
        className="relative w-full max-w-xl max-h-[90vh] flex flex-col rounded-2xl bg-[#0f0f0f]/95 border border-white/10 shadow-2xl backdrop-blur-2xl text-white overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-white flex items-center gap-2">
              <span>Focus Tasks</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/80 font-normal">
                {completedToday}/{todayTasks.length} today
              </span>
            </h2>
            <p className="text-xs text-white/60 mt-0.5">
              Prioritize assignments, syllabus chapters, and study goals.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close tasks modal"
            className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors text-white/80 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Task Creation Form */}
        <form
          onSubmit={handleCreate}
          className="p-5 border-b border-white/10 bg-white/[0.02] flex flex-col gap-3"
        >
          <div className="flex items-center gap-2">
            <input
              type="text"
              id="new-task-title-input"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Add a new focus task (e.g., Read Calculus Chapter 4)..."
              className="flex-1 rounded-xl bg-white/10 px-4 py-2.5 text-sm text-white placeholder-white/40 border border-white/10 focus:outline-none focus:border-white/30"
            />
            <button
              type="submit"
              id="add-task-submit-button"
              disabled={!newTitle.trim()}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-white flex items-center gap-1.5 transition-opacity disabled:opacity-40 cursor-pointer"
              style={{ background: 'linear-gradient(to bottom, #2B2B2B, #101010)' }}
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </div>

          {/* Quick Selectors for Priority, Subject, and Group */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-white/70">
            <div className="flex items-center gap-2">
              <span className="text-white/50 flex items-center gap-1">
                <Tag className="w-3 h-3" /> Subject:
              </span>
              <div className="relative inline-flex items-center">
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="appearance-none bg-white/10 border border-white/10 rounded-lg pl-2.5 pr-6 py-1 text-white text-xs focus:outline-none cursor-pointer"
                >
                  <option value="General" className="bg-[#1a1a1a]">General</option>
                  <option value="Mathematics" className="bg-[#1a1a1a]">Mathematics</option>
                  <option value="Computer Science" className="bg-[#1a1a1a]">Computer Science</option>
                  <option value="Physics / Chem" className="bg-[#1a1a1a]">Physics / Chem</option>
                  <option value="Literature" className="bg-[#1a1a1a]">Literature</option>
                  <option value="Exam Prep" className="bg-[#1a1a1a]">Exam Prep</option>
                </select>
                <ChevronDown className="w-3 h-3 text-white/50 pointer-events-none absolute right-1.5" />
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-white/50 mr-1">Priority:</span>
              {(['high', 'medium', 'low'] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`px-2 py-0.5 rounded-full capitalize cursor-pointer transition-colors ${
                    priority === p
                      ? p === 'high'
                        ? 'bg-rose-500/25 text-rose-300 border border-rose-500/40'
                        : p === 'medium'
                        ? 'bg-amber-500/25 text-amber-300 border border-amber-500/40'
                        : 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/40'
                      : 'bg-white/5 text-white/50 hover:text-white/80'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setGroup('today')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  group === 'today'
                    ? 'bg-white/15 text-white font-medium'
                    : 'text-white/50 hover:text-white/80'
                }`}
              >
                For Today
              </button>
              <button
                type="button"
                onClick={() => setGroup('upcoming')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  group === 'upcoming'
                    ? 'bg-white/15 text-white font-medium'
                    : 'text-white/50 hover:text-white/80'
                }`}
              >
                Upcoming
              </button>
            </div>
          </div>
        </form>

        {/* View Filter tabs */}
        <div className="flex items-center gap-2 px-6 pt-3 pb-1 border-b border-white/5 text-xs">
          <button
            type="button"
            onClick={() => setFilterGroup('today')}
            className={`pb-2 px-1 border-b-2 font-medium transition-colors cursor-pointer ${
              filterGroup === 'today'
                ? 'border-white text-white'
                : 'border-transparent text-white/50 hover:text-white/80'
            }`}
          >
            Today ({tasks.filter((t) => t.group === 'today').length})
          </button>
          <button
            type="button"
            onClick={() => setFilterGroup('upcoming')}
            className={`pb-2 px-1 border-b-2 font-medium transition-colors cursor-pointer ${
              filterGroup === 'upcoming'
                ? 'border-white text-white'
                : 'border-transparent text-white/50 hover:text-white/80'
            }`}
          >
            Upcoming ({tasks.filter((t) => t.group === 'upcoming').length})
          </button>
          <button
            type="button"
            onClick={() => setFilterGroup('all')}
            className={`pb-2 px-1 border-b-2 font-medium transition-colors cursor-pointer ${
              filterGroup === 'all'
                ? 'border-white text-white'
                : 'border-transparent text-white/50 hover:text-white/80'
            }`}
          >
            All ({tasks.length})
          </button>
        </div>

        {/* Tasks List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-2.5 max-h-80">
          {filteredTasks.length === 0 ? (
            <div className="py-8 text-center text-white/40 text-sm">
              No tasks in this view. Add one above to kickstart your focus!
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                id={`task-row-${task.id}`}
                className={`group flex items-center justify-between p-3 rounded-xl border transition-all ${
                  task.completed
                    ? 'bg-white/[0.02] border-white/5 opacity-60'
                    : 'bg-white/[0.05] border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <button
                    type="button"
                    onClick={() => {
                      onToggleTask(task.id);
                      playChime(task.completed ? 'click' : 'complete');
                    }}
                    className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                      task.completed
                        ? 'bg-white text-black'
                        : 'border border-white/40 hover:border-white'
                    }`}
                  >
                    {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>

                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-sm truncate font-medium ${
                        task.completed
                          ? 'line-through text-white/50'
                          : 'text-white'
                      }`}
                    >
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-white/50 mt-0.5">
                      <span>{task.subject}</span>
                      <span>·</span>
                      <span
                        className={`capitalize ${
                          task.priority === 'high'
                            ? 'text-rose-400'
                            : task.priority === 'medium'
                            ? 'text-amber-400'
                            : 'text-emerald-400'
                        }`}
                      >
                        {task.priority}
                      </span>
                      <span>·</span>
                      <span className="capitalize">{task.group}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onDeleteTask(task.id);
                    playChime('click');
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-rose-400 transition-all cursor-pointer"
                  title="Delete task"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between text-xs text-white/50 bg-white/[0.01]">
          <span>Synced with Today's Progress</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer font-medium"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
