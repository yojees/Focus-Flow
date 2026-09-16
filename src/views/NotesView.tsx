import React, { useState } from 'react';
import {
  Plus,
  Search,
  Pin,
  Trash2,
  Edit2,
  BookOpen,
  Check,
  X,
  FileText,
} from 'lucide-react';
import { Note, NoteCategory } from '../types';

interface NotesViewProps {
  notes: Note[];
  onAddNote: (note: Omit<Note, 'id' | 'updatedAt'>) => void;
  onUpdateNote: (id: string, updates: Partial<Note>) => void;
  onDeleteNote: (id: string) => void;
}

export const NotesView: React.FC<NotesViewProps> = ({
  notes,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

  // New Note modal or active editor
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<NoteCategory>('study');

  const categories: { id: string; label: string }[] = [
    { id: 'all', label: 'All Notes' },
    { id: 'study', label: 'Study' },
    { id: 'ideas', label: 'Ideas' },
    { id: 'revision', label: 'Revision' },
    { id: 'coding', label: 'Coding' },
    { id: 'important', label: 'Important' },
  ];

  const handleSaveNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() && !content.trim()) return;

    onAddNote({
      title: title.trim() || 'Untitled Note',
      content: content.trim(),
      category,
      isPinned: false,
      isArchived: false,
    });

    setTitle('');
    setContent('');
    setIsCreating(false);
  };

  const handleTogglePin = (note: Note) => {
    onUpdateNote(note.id, { isPinned: !note.isPinned });
  };

  // Filter notes
  const filteredNotes = notes.filter((n) => {
    if (selectedCategory !== 'all' && n.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = n.title.toLowerCase().includes(q);
      const matchContent = n.content.toLowerCase().includes(q);
      if (!matchTitle && !matchContent) return false;
    }
    return true;
  });

  // Sort pinned first
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return b.updatedAt - a.updatedAt;
  });

  return (
    <div id="notes-view" className="p-4 sm:p-8 max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-white">Study Notebook</h2>
          <p className="text-xs sm:text-sm text-white/60 mt-1">
            Distraction-free markdown-friendly scratchpad for formulas, code snippets, and concepts.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreating(true)}
          style={{ background: 'linear-gradient(to bottom, #2B2B2B, #101010)' }}
          className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white border border-white/20 flex items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer shadow-md self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Note</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-white/5 border border-white/10">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-white/15 text-white shadow-sm'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes..."
            className="pl-8 pr-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-white/40 focus:outline-none focus:border-white/30 w-full sm:w-56"
          />
        </div>
      </div>

      {/* Note Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedNotes.map((note) => {
          const isEditing = editingNoteId === note.id;

          return (
            <div
              key={note.id}
              className={`p-5 rounded-2xl border flex flex-col justify-between transition-all group ${
                note.isPinned
                  ? 'bg-white/[0.07] border-white/20 shadow-md'
                  : 'bg-white/5 hover:bg-white/[0.07] border-white/10'
              }`}
            >
              <div>
                {/* Note Top row: Category badge + Pin + Actions */}
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-semibold text-white/70 uppercase tracking-wider">
                    {note.category}
                  </span>

                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => handleTogglePin(note)}
                      title={note.isPinned ? 'Unpin' : 'Pin note'}
                      className={`p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer ${
                        note.isPinned ? 'text-amber-400' : 'text-white/40 hover:text-white'
                      }`}
                    >
                      <Pin className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteNote(note.id)}
                      title="Delete note"
                      className="p-1.5 rounded-lg text-white/40 hover:text-rose-400 hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-sm font-semibold text-white tracking-tight mb-2">
                  {note.title}
                </h3>

                {/* Content */}
                <p className="text-xs text-white/70 leading-relaxed whitespace-pre-line line-clamp-6">
                  {note.content}
                </p>
              </div>

              {/* Note Footer: timestamp */}
              <div className="pt-4 mt-4 border-t border-white/5 text-[10px] text-white/40 flex items-center justify-between">
                <span>{new Date(note.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                <span className="text-white/30 font-mono">
                  {note.content.split(/\s+/).filter(Boolean).length} words
                </span>
              </div>
            </div>
          );
        })}

        {sortedNotes.length === 0 && (
          <div className="col-span-full p-12 rounded-2xl bg-white/[0.02] border border-white/5 text-center">
            <FileText className="w-8 h-8 text-white/30 mx-auto mb-2" />
            <p className="text-sm text-white/50">
              {notes.length === 0
                ? 'No notes created yet. Capture key ideas, formulas, or reminders here.'
                : 'No notes found for this filter.'}
            </p>
            <button
              type="button"
              onClick={() => setIsCreating(true)}
              className="mt-2 text-xs text-white underline underline-offset-4 hover:text-white/80 cursor-pointer"
            >
              Draft your first study note
            </button>
          </div>
        )}
      </div>

      {/* Create Note Modal */}
      {isCreating && (
        <div
          id="create-note-modal-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div
            id="create-note-modal-card"
            className="w-full max-w-lg rounded-2xl bg-[#111111] border border-white/15 shadow-2xl p-6 sm:p-8 text-white"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Create New Study Note</h3>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="text-white/50 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNew} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Cognitive Psychology: Working Memory"
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-xs text-white placeholder-white/40 focus:outline-none"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">Category</label>
                <div className="flex flex-wrap gap-2">
                  {categories.filter((c) => c.id !== 'all').map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setCategory(c.id as NoteCategory)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                        category === c.id
                          ? 'bg-white/15 border-white/30 text-white'
                          : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">Content</label>
                <textarea
                  rows={6}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write formulas, summary points, key theorems, or ideas..."
                  className="w-full rounded-xl bg-white/5 border border-white/10 p-3 text-xs text-white placeholder-white/40 focus:outline-none resize-none leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-white/70 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ background: 'linear-gradient(to bottom, #2B2B2B, #101010)' }}
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-white border border-white/20 hover:opacity-90 transition-opacity cursor-pointer shadow-md"
                >
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
