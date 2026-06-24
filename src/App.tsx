import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useAppStore } from '@/store/appStore';
import { AppShell } from '@/components/layout/AppShell';
import { DashboardPage } from '@/pages/DashboardPage';
import { ClientsPage } from '@/pages/ClientsPage';
import { ClientProfilePage } from '@/pages/ClientProfilePage';
import { PipelinePage } from '@/pages/PipelinePage';
import { TasksPage } from '@/pages/TasksPage';
import { CalendarPage } from '@/pages/CalendarPage';
import { ReportsPage } from '@/pages/ReportsPage';
import { NotesPage } from '@/pages/NotesPage';
import { AutomationsPage } from '@/pages/AutomationsPage';
import { AIPage } from '@/pages/AIPage';
import { SettingsPage } from '@/pages/SettingsPage';

export default function App() {
  const { theme, setCurrentPath } = useAppStore();
  const location = useLocation();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location.pathname, setCurrentPath]);

  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/clients" element={<ClientsPage />} />
        <Route path="/clients/:id" element={<ClientProfilePage />} />
        <Route path="/pipeline" element={<PipelinePage />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/notes" element={<NotesPage />} />
        <Route path="/automations" element={<AutomationsPage />} />
        <Route path="/ai" element={<AIPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AppShell>
  );
}