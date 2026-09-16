import React, { useState } from 'react';
import { FileText, X, Check } from 'lucide-react';
import { Note } from '../types';

interface QuickNotesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveQuickNote: (text: string) => void;
  recentNotes: Note[];
}

export const QuickNotesDrawer: React.FC<QuickNotesDrawerProps> = ({
  isOpen,
  onClose,
  onSaveQuickNote,
  recentNotes,
}) => {
  const [content, setContent] = useState('');
  const [savedFeedback, setSavedFeedback] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSaveQuickNote(content.trim());
    setContent('');
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2000);
  };

  return (
    <div
      id="quick-notes-drawer-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        id="quick-notes-drawer"
        className="w-full max-w-sm rounded-2xl bg-[#141414] border border-white/15 shadow-2xl p-5 text-white flex flex-col gap-3"
      >
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-white" />
            <h4 className="text-sm font-semibold text-white">Focus Scratchpad</h4>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-6 h-6 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <p className="text-xs text-white/50">
          Jot thoughts quickly without interrupting your active focus flow.
        </p>

        <form onSubmit={handleSave} className="space-y-2">
          <textarea
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="e.g. Check JavaScript arrays tomorrow..."
            className="w-full rounded-xl bg-white/5 border border-white/10 p-3 text-xs text-white placeholder-white/40 focus:outline-none focus:border-white/30 resize-none"
            autoFocus
          />

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-emerald-400">
              {savedFeedback && 'Saved to Notes!'}
            </span>
            <button
              type="submit"
              disabled={!content.trim()}
              style={{ background: 'linear-gradient(to bottom, #2B2B2B, #101010)' }}
              className="px-4 py-1.5 rounded-lg text-xs font-medium text-white border border-white/10 hover:opacity-90 disabled:opacity-40 transition-opacity cursor-pointer"
            >
              Save Note
            </button>
          </div>
        </form>

        {recentNotes.length > 0 && (
          <div className="mt-2 pt-2 border-t border-white/10">
            <span className="text-[10px] uppercase font-semibold text-white/40 tracking-wider block mb-1.5">
              Recent thoughts:
            </span>
            <div className="space-y-1.5 max-h-28 overflow-y-auto">
              {recentNotes.slice(0, 3).map((n) => (
                <div
                  key={n.id}
                  className="p-2 rounded-lg bg-white/[0.02] border border-white/5 text-[11px] text-white/70 truncate"
                >
                  {n.title || n.content}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
