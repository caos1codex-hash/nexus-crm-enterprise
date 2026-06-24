import { NavLink } from 'react-router-dom';
import { useAppStore, useCRMStore } from '@/store/appStore';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, Users, GitBranch, CheckSquare, Calendar,
  BarChart3, FileText, Zap, Brain, Settings, ChevronLeft, ChevronRight,
  X, Briefcase
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/clients', icon: Users, label: 'Clientes', badgeKey: 'clients' },
  { path: '/pipeline', icon: GitBranch, label: 'Pipeline', badgeKey: 'pipeline' },
  { path: '/tasks', icon: CheckSquare, label: 'Tareas', badgeKey: 'tasks' },
  { path: '/calendar', icon: Calendar, label: 'Calendario', badgeKey: 'calendar' },
  { path: '/reports', icon: BarChart3, label: 'Reportes' },
  { path: '/notes', icon: FileText, label: 'Notas' },
  { path: '/automations', icon: Zap, label: 'Automatiz.' },
  { path: '/ai', icon: Brain, label: 'IA', badgeKey: 'ai' },
  { path: '/settings', icon: Settings, label: 'Configuración' },
];

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar, currentPath } = useAppStore();
  const { tasks, calendarEvents, opportunities, aiInsights } = useCRMStore();

  // Compute badges
  const badges: Record<string, { count: number; variant: 'danger' | 'warning' | 'info' }> = {};
  const pendingUrgent = tasks.filter(t => t.status === 'pendiente' && (t.priority === 'urgente' || t.priority === 'alta')).length;
  if (pendingUrgent > 0) badges['tasks'] = { count: pendingUrgent, variant: 'danger' };

  const today = new Date().toISOString().split('T')[0];
  const todayMeetings = calendarEvents.filter(e => e.date === today && e.type === 'reunion').length;
  if (todayMeetings > 0) badges['calendar'] = { count: todayMeetings, variant: 'info' };

  const aiAlerts = aiInsights.filter(i => i.type === 'alert').length;
  if (aiAlerts > 0) badges['ai'] = { count: aiAlerts, variant: 'warning' };

  const negotiating = opportunities.filter(o => o.stage === 'negociacion').length;
  if (negotiating > 0) badges['pipeline'] = { count: negotiating, variant: 'info' };

  return (
    <>
      <AnimatePresence>
        {!sidebarCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>
      <motion.aside
        className={cn(
          "fixed top-0 left-0 z-50 h-screen bg-sidebar-bg border-r border-sidebar-border flex flex-col transition-colors duration-200",
          "lg:relative lg:z-auto",
          sidebarCollapsed ? "w-[68px]" : "w-[250px]"
        )}
        animate={{ width: sidebarCollapsed ? 68 : 250 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
      >
        {/* Logo */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-sidebar-border flex-shrink-0">
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2.5 overflow-hidden"
            >
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                <Briefcase className="w-4 h-4 text-primary-foreground" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[13px] font-bold text-sidebar-foreground tracking-tight">Nexus CRM</span>
                <span className="text-[9px] text-sidebar-foreground/40 font-semibold tracking-widest uppercase">Enterprise</span>
              </div>
            </motion.div>
          )}
          {sidebarCollapsed && (
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center mx-auto">
              <Briefcase className="w-4 h-4 text-primary-foreground" />
            </div>
          )}
          <button onClick={toggleSidebar} className="hidden lg:flex items-center justify-center w-7 h-7 rounded-md hover:bg-sidebar-hover text-sidebar-foreground/40 hover:text-sidebar-foreground transition-colors">
            {sidebarCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>
          {!sidebarCollapsed && (
            <button onClick={toggleSidebar} className="lg:hidden flex items-center justify-center w-7 h-7 rounded-md hover:bg-sidebar-hover text-sidebar-foreground/40 hover:text-sidebar-foreground transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-2.5 px-2.5 space-y-0.5">
          {navItems.map((item) => {
            const isActive = currentPath.startsWith(item.path);
            const badge = badges[item.badgeKey || ''];
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 group relative",
                  isActive
                    ? "bg-sidebar-active text-sidebar-foreground"
                    : "text-sidebar-foreground/50 hover:text-sidebar-foreground/90 hover:bg-sidebar-hover/60"
                )}
                title={sidebarCollapsed ? item.label : undefined}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 bg-primary rounded-r-full"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <item.icon className={cn("w-[17px] h-[17px] flex-shrink-0", isActive && "text-primary")} />
                {!sidebarCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="truncate flex-1"
                  >
                    {item.label}
                  </motion.span>
                )}
                {!sidebarCollapsed && badge && (
                  <span className={cn(
                    "text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none",
                    badge.variant === 'danger' && 'bg-red-500/20 text-red-400',
                    badge.variant === 'warning' && 'bg-amber-500/20 text-amber-400',
                    badge.variant === 'info' && 'bg-blue-500/20 text-blue-400',
                  )}>
                    {badge.count}
                  </span>
                )}
                {sidebarCollapsed && badge && (
                  <span className={cn(
                    "absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center",
                    badge.variant === 'danger' && 'bg-red-500 text-white',
                    badge.variant === 'warning' && 'bg-amber-500 text-white',
                    badge.variant === 'info' && 'bg-blue-500 text-white',
                  )}>
                    {badge.count > 9 ? '9+' : badge.count}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User */}
        <div className="p-2.5 border-t border-sidebar-border flex-shrink-0">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-sidebar-hover/60 transition-colors cursor-pointer">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-[11px] font-bold flex-shrink-0">AR</div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-sidebar-bg" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-sidebar-foreground truncate">Alejandro Ruiz</span>
                <span className="text-[10px] text-sidebar-foreground/40">Administrador</span>
              </div>
            </div>
          )}
          {sidebarCollapsed && (
            <div className="relative mx-auto">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-[11px] font-bold">AR</div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-sidebar-bg" />
            </div>
          )}
        </div>
      </motion.aside>
    </>
  );
}