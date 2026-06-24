import { NavLink } from 'react-router-dom';
import { useAppStore } from '@/store/appStore';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, Users, GitBranch, CheckSquare, Calendar,
  BarChart3, FileText, Zap, Brain, Settings, ChevronLeft, ChevronRight,
  X, Briefcase
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/clients', icon: Users, label: 'Clientes' },
  { path: '/pipeline', icon: GitBranch, label: 'Pipeline' },
  { path: '/tasks', icon: CheckSquare, label: 'Tareas' },
  { path: '/calendar', icon: Calendar, label: 'Calendario' },
  { path: '/reports', icon: BarChart3, label: 'Reportes' },
  { path: '/notes', icon: FileText, label: 'Notas' },
  { path: '/automations', icon: Zap, label: 'Automatiz.' },
  { path: '/ai', icon: Brain, label: 'IA Empresarial' },
  { path: '/settings', icon: Settings, label: 'Configuración' },
];

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar, currentPath } = useAppStore();

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
          sidebarCollapsed ? "w-[72px]" : "w-[260px]"
        )}
        animate={{ width: sidebarCollapsed ? 72 : 260 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border flex-shrink-0">
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2.5 overflow-hidden"
            >
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                <Briefcase className="w-4.5 h-4.5 text-primary-foreground" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-semibold text-sidebar-foreground tracking-tight">Nexus CRM</span>
                <span className="text-[10px] text-sidebar-foreground/50 font-medium tracking-wider uppercase">Enterprise</span>
              </div>
            </motion.div>
          )}
          {sidebarCollapsed && (
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center mx-auto">
              <Briefcase className="w-4.5 h-4.5 text-primary-foreground" />
            </div>
          )}
          <button onClick={toggleSidebar} className="hidden lg:flex items-center justify-center w-7 h-7 rounded-md hover:bg-sidebar-hover text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors">
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
          {!sidebarCollapsed && (
            <button onClick={toggleSidebar} className="lg:hidden flex items-center justify-center w-7 h-7 rounded-md hover:bg-sidebar-hover text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
          {navItems.map((item) => {
            const isActive = currentPath.startsWith(item.path);
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group relative",
                  isActive
                    ? "bg-sidebar-active text-sidebar-foreground"
                    : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-hover"
                )}
                title={sidebarCollapsed ? item.label : undefined}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-r-full"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <item.icon className={cn("w-[18px] h-[18px] flex-shrink-0", isActive && "text-primary")} />
                {!sidebarCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="truncate"
                  >
                    {item.label}
                  </motion.span>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-3 border-t border-sidebar-border flex-shrink-0">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-semibold flex-shrink-0">AR</div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-medium text-sidebar-foreground truncate">Alejandro Ruiz</span>
                <span className="text-[10px] text-sidebar-foreground/50">Administrador</span>
              </div>
            </div>
          )}
        </div>
      </motion.aside>
    </>
  );
}