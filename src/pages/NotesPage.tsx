import { useState } from 'react';
import { useCRMStore } from '@/store/appStore';
import { cn, timeAgo } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Search, Pin, Tag, FileText } from 'lucide-react';
import { generateId } from '@/lib/utils';

export function NotesPage() {
  const { notes, addNote, deleteNote } = useCRMStore();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedNote, setSelectedNote] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', content: '', clientId: '', tags: '' });

  const filtered = search
    ? notes.filter(n => `${n.title} ${n.content} ${n.clientName || ''}`.toLowerCase().includes(search.toLowerCase()))
    : notes;
  const pinned = filtered.filter(n => n.isPinned);
  const unpinned = filtered.filter(n => !n.isPinned);
  const activeNote = notes.find(n => n.id === selectedNote);

  const handleAdd = () => {
    addNote({
      id: generateId(),
      ...form,
      clientId: form.clientId || undefined,
      clientName: form.clientId ? notes.find(n => n.clientId === form.clientId)?.clientName : undefined,
      createdBy: 'u1',
      createdByName: 'Alejandro Ruiz',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: form.tags ? form.tags.split(',').map(t => t.trim()) : [],
      isPinned: false,
    });
    setShowModal(false);
    setForm({ title: '', content: '', clientId: '', tags: '' });
  };

  const renderNoteCard = (n: typeof notes[0]) => (
    <button
      key={n.id}
      onClick={() => setSelectedNote(n.id)}
      className={cn(
        'w-full text-left bg-card border border-border rounded-xl p-4 hover:shadow-sm transition-all',
        selectedNote === n.id && 'ring-1 ring-primary/40 bg-primary/5'
      )}
    >
      <div className="flex items-start justify-between mb-1">
        <p className="text-sm font-medium flex-1">{n.title}</p>
        {n.isPinned && <Pin className="w-3.5 h-3.5 text-primary flex-shrink-0 ml-2" />}
      </div>
      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{n.content}</p>
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-muted-foreground">{timeAgo(n.updatedAt)}</span>
        {n.clientName && <span className="text-[11px] text-primary">{n.clientName}</span>}
      </div>
    </button>
  );

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Notas</h2>
          <p className="text-muted-foreground text-sm mt-1">{notes.length} notas creadas</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />Nueva Nota
        </button>
      </div>

      <div className="relative mb-5">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar notas..."
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto">
          {pinned.length > 0 && <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">Fijadas</p>}
          {pinned.map(renderNoteCard)}
          {unpinned.length > 0 && (
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1 pt-2">
              {pinned.length > 0 ? 'Otras' : 'Todas'}
            </p>
          )}
          {unpinned.map(renderNoteCard)}
        </div>

        <div className="lg:col-span-2">
          {activeNote ? (
            <motion.div key={activeNote.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold">{activeNote.title}</h3>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span>{activeNote.createdByName}</span>
                    <span>·</span>
                    <span>{timeAgo(activeNote.createdAt)}</span>
                    {activeNote.clientName && (
                      <span className="text-primary">· {activeNote.clientName}</span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => { deleteNote(activeNote.id); setSelectedNote(null); }}
                  className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="prose prose-sm dark:prose-invert max-w-none text-sm leading-relaxed whitespace-pre-wrap">
                {activeNote.content}
              </div>
              {activeNote.tags.length > 0 && (
                <div className="flex items-center gap-2 mt-6 pt-4 border-t border-border">
                  <Tag className="w-3.5 h-3.5 text-muted-foreground" />
                  {activeNote.tags.map(t => (
                    <span key={t} className="px-2.5 py-0.5 rounded-full bg-muted text-xs font-medium text-muted-foreground">{t}</span>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <div className="bg-card border border-border rounded-xl h-full min-h-[400px] flex flex-col items-center justify-center text-muted-foreground">
              <FileText className="w-12 h-12 mb-3 text-muted-foreground/30" />
              <p className="text-sm">Selecciona una nota para ver su contenido</p>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              className="w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <h3 className="text-lg font-semibold">Nueva Nota</h3>
                <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="px-6 py-5 space-y-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Título</label>
                  <input
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Contenido</label>
                  <textarea
                    value={form.content}
                    onChange={e => setForm({ ...form, content: e.target.value })}
                    rows={6}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Etiquetas (separadas por coma)</label>
                  <input
                    value={form.tags}
                    onChange={e => setForm({ ...form, tags: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted">
                  Cancelar
                </button>
                <button onClick={handleAdd} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90">
                  Crear Nota
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}