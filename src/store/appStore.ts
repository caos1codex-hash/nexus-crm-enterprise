import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Notification, Client, Opportunity, Task, Activity, Note, CalendarEvent, Automation, AIInsight } from '@/types';
import { clients as mockClients, opportunities as mockOpportunities, tasks as mockTasks, activities as mockActivities, notes as mockNotes, calendarEvents as mockCalendarEvents, notifications as mockNotifications, automations as mockAutomations, aiInsights as mockAiInsights, users as mockUsers } from '@/data/mockData';

interface AppState {
  theme: 'light' | 'dark';
  sidebarCollapsed: boolean;
  currentPath: string;
  searchQuery: string;
  searchOpen: boolean;
  notifications: Notification[];
  toggleTheme: () => void;
  toggleSidebar: () => void;
  setCurrentPath: (path: string) => void;
  setSearchQuery: (q: string) => void;
  setSearchOpen: (open: boolean) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addNotification: (n: Notification) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'dark',
      sidebarCollapsed: false,
      currentPath: '/dashboard',
      searchQuery: '',
      searchOpen: false,
      notifications: mockNotifications,
      toggleTheme: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setCurrentPath: (path) => set({ currentPath: path }),
      setSearchQuery: (q) => set({ searchQuery: q }),
      setSearchOpen: (open) => set({ searchOpen: open }),
      markNotificationRead: (id) => set((s) => ({
        notifications: s.notifications.map((n) => n.id === id ? { ...n, read: true } : n),
      })),
      markAllNotificationsRead: () => set((s) => ({
        notifications: s.notifications.map((n) => ({ ...n, read: true })),
      })),
      addNotification: (n) => set((s) => ({
        notifications: [n, ...s.notifications],
      })),
    }),
    { name: 'nexus-app-settings', partialize: (state) => ({ theme: state.theme, sidebarCollapsed: state.sidebarCollapsed }) }
  )
);

interface CRMState {
  clients: Client[];
  opportunities: Opportunity[];
  tasks: Task[];
  activities: Activity[];
  notes: Note[];
  calendarEvents: CalendarEvent[];
  automations: Automation[];
  aiInsights: AIInsight[];
  users: typeof mockUsers;
  addClient: (c: Client) => void;
  updateClient: (id: string, c: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  addOpportunity: (o: Opportunity) => void;
  updateOpportunity: (id: string, o: Partial<Opportunity>) => void;
  moveOpportunityStage: (id: string, stage: Opportunity['stage']) => void;
  addTask: (t: Task) => void;
  updateTask: (id: string, t: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  addNote: (n: Note) => void;
  updateNote: (n: Note) => void;
  deleteNote: (id: string) => void;
  addCalendarEvent: (e: CalendarEvent) => void;
  toggleAutomation: (id: string) => void;
}

export const useCRMStore = create<CRMState>()((set) => ({
  clients: mockClients,
  opportunities: mockOpportunities,
  tasks: mockTasks,
  activities: mockActivities,
  notes: mockNotes,
  calendarEvents: mockCalendarEvents,
  automations: mockAutomations,
  aiInsights: mockAiInsights,
  users: mockUsers,
  addClient: (c) => set((s) => ({ clients: [c, ...s.clients] })),
  updateClient: (id, c) => set((s) => ({ clients: s.clients.map((cl) => cl.id === id ? { ...cl, ...c, updatedAt: new Date().toISOString() } : cl) })),
  deleteClient: (id) => set((s) => ({ clients: s.clients.filter((c) => c.id !== id) })),
  addOpportunity: (o) => set((s) => ({ opportunities: [o, ...s.opportunities] })),
  updateOpportunity: (id, o) => set((s) => ({ opportunities: s.opportunities.map((op) => op.id === id ? { ...op, ...o, updatedAt: new Date().toISOString() } : op) })),
  moveOpportunityStage: (id, stage) => set((s) => ({
    opportunities: s.opportunities.map((op) => op.id === id ? { ...op, stage, updatedAt: new Date().toISOString() } : op),
  })),
  addTask: (t) => set((s) => ({ tasks: [t, ...s.tasks] })),
  updateTask: (id, t) => set((s) => ({ tasks: s.tasks.map((tk) => tk.id === id ? { ...tk, ...t } : tk) })),
  deleteTask: (id) => set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),
  addNote: (n) => set((s) => ({ notes: [n, ...s.notes] })),
  updateNote: (n) => set((s) => ({ notes: s.notes.map((nt) => nt.id === n.id ? { ...nt, ...n, updatedAt: new Date().toISOString() } : nt) })),
  deleteNote: (id) => set((s) => ({ notes: s.notes.filter((n) => n.id !== id) })),
  addCalendarEvent: (e) => set((s) => ({ calendarEvents: [...s.calendarEvents, e] })),
  toggleAutomation: (id) => set((s) => ({ automations: s.automations.map((a) => a.id === id ? { ...a, isActive: !a.isActive } : a) })),
}));