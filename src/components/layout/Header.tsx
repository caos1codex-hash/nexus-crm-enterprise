import { useAppStore, useCRMStore } from '@/store/appStore';
import { cn } from '@/lib/utils';
import { Search, Bell, Sun, Moon, Menu, Command } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export function Header() {
  const { theme, toggleTheme, toggleSidebar, searchOpen, setSearchOpen, setSearchQuery, searchQuery, notifications, markNotificationRead, markAllNotificationsRead } = useAppStore();
  const { clients, opportunities, tasks, calendarEvents, users } = useCRMStore();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter(n => !n.read).length;

  const searchResults = searchQuery.length > 1 ? [
    ...clients.filter(c => `${c.firstName} ${c.lastName} ${c.company}`.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 3).map(c => ({ type: 'cliente' as const, id: c.id, label: `${c.firstName} ${c.lastName}`, sub: c.company, path: `/clients/${c.id}` })),
    ...opportunities.filter(o => o.title.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 3).map(o => ({ type: 'oportunidad' as const, id: o.id, label: o.title, sub: o.clientName, path: '/pipeline' })),
    ...tasks.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 3).map(t => ({ type: 'tarea' as const, id: t.id, label: t.title, sub: t.assignedName, path: '/tasks' })),
  ] : [];

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setShowSearch(true); setSearchOpen(true); }
      if (e.key === 'Escape') { setShowSearch(false); setShowNotifications(false); setSearchOpen(false); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifications(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const pathLabels: Record<string, string> = {
    '/dashboard': 'Dashboard', '/clients': 'Clientes', '/pipeline': 'Pipeline de Ventas',
    '/tasks': 'Tareas', '/calendar': 'Calendario', '/reports': 'Reportes',
    '/notes': 'Notas', '/automations': 'Automatizaciones', '/ai': 'IA Empresarial', '/settings': 'Configuración',
  };
  const currentPath = useAppStore.getState().currentPath;
  const pageTitle = Object.entries(pathLabels).find(([k]) => currentPath.startsWith(k))?.[1] || 'Nexus CRM';

  const onlineCount = users.filter(u => u.status === 'online').length;

  return (
    <>
      <header className="h-14 border-b border-border bg-card/80 backdrop-blur-xl flex items-center justify-between px-5 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button onClick={toggleSidebar} className="lg:hidden p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors">
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-[15px] font-semibold tracking-tight">{pageTitle}</h1>
          </div>
          {/* Live indicator */}
          <div className="hidden md:flex items-center gap-1.5 ml-3 px-2.5 py-1 rounded-full bg-emerald-500/8 border border-emerald-500/15">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
            </span>
            <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">{onlineCount} en línea</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => { setShowSearch(true); setSearchOpen(true); }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-muted/30 text-muted-foreground text-sm hover:bg-muted/60 transition-colors w-[200px] lg:w-[260px]"
          >
            <Search className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="flex-1 text-left text-xs">Buscar...</span>
            <kbd className="hidden sm:flex items-center gap-0.5 px-1 py-0.5 rounded bg-background border border-border text-[9px] font-medium text-muted-foreground">
              <Command className="w-2.5 h-2.5" />K
            </kbd>
          </button>
          <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <div ref={notifRef} className="relative">
            <button onClick={() => setShowNotifications(!showNotifications)} className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors relative">
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-0.5 right-0.5 min-w-[16px] h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center px-1">
                  {unreadCount}
                </span>
              )}
            </button>
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-96 bg-popover border border-border rounded-xl shadow-2xl overflow-hidden z-50"
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">Notificaciones</span>
                      {unreadCount > 0 && (
                        <span className="text-[10px] font-bold bg-red-500/15 text-red-500 px-1.5 py-0.5 rounded-full">{unreadCount} nuevas</span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button onClick={markAllNotificationsRead} className="text-[11px] text-primary hover:underline font-medium">Marcar leídas</button>
                    )}
                  </div>
                  <div className="max-h-[380px] overflow-y-auto">
                    {notifications.slice(0, 6).map(n => (
                      <button key={n.id} onClick={() => { markNotificationRead(n.id); if (n.link) navigate(n.link); setShowNotifications(false); }} className={cn("w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors border-b border-border/30 last:border-0", !n.read && "bg-primary/3")}>
                        <div className="flex items-start gap-3">
                          <div className={cn("w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0", n.type === 'success' && "bg-emerald-500", n.type === 'warning' && "bg-amber-500", n.type === 'error' && "bg-red-500", n.type === 'info' && "bg-blue-500")} />
                          <div className="min-w-0 flex-1">
                            <p className="text-[13px] font-medium truncate">{n.title}</p>
                            <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">{n.message}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="relative ml-0.5">
            <div className="w-8 h-8 rounded-full bg-primary/12 flex items-center justify-center text-primary text-[11px] font-bold cursor-pointer hover:bg-primary/20 transition-colors">AR</div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-card" />
          </div>
        </div>
      </header>

      <AnimatePresence>
        {(showSearch || searchOpen) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-start justify-center pt-[15vh]"
            onClick={() => { setShowSearch(false); setSearchOpen(false); setSearchQuery(''); }}
          >
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.96 }}
              className="w-full max-w-lg bg-popover border border-border rounded-xl shadow-2xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 px-4 border-b border-border">
                <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Buscar clientes, oportunidades, tareas..."
                  className="flex-1 py-3 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
                <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border text-[10px] font-medium text-muted-foreground">ESC</kbd>
              </div>
              {searchResults.length > 0 && (
                <div className="max-h-[300px] overflow-y-auto py-2">
                  {searchResults.map(r => (
                    <button key={`${r.type}-${r.id}`} onClick={() => { navigate(r.path); setShowSearch(false); setSearchOpen(false); setSearchQuery(''); }} className="w-full text-left px-4 py-2.5 hover:bg-muted/50 transition-colors flex items-center gap-3">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground bg-muted px-1.5 py-0.5 rounded flex-shrink-0 w-16 text-center">{r.type}</span>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{r.label}</p>
                        <p className="text-xs text-muted-foreground truncate">{r.sub}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              {searchQuery.length > 1 && searchResults.length === 0 && (
                <div className="py-8 text-center text-sm text-muted-foreground">No se encontraron resultados</div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}