export type UserRole = 'admin' | 'supervisor' | 'vendedor' | 'invitado';
export type ClientStatus = 'activo' | 'inactivo' | 'potencial' | 'perdido';
export type LeadSource = 'web' | 'referido' | 'linkedin' | 'evento' | 'cold_call' | 'otro';
export type Priority = 'baja' | 'media' | 'alta' | 'urgente';
export type TaskStatus = 'pendiente' | 'en_progreso' | 'completada' | 'cancelada';
export type OpportunityStage = 'lead' | 'contactado' | 'calificado' | 'reunion' | 'propuesta' | 'negociacion' | 'ganado' | 'perdido';
export type ActivityType = 'llamada' | 'email' | 'reunion' | 'nota' | 'cambio_estado' | 'tarea' | 'comentario';
export type NotificationType = 'info' | 'success' | 'warning' | 'error';
export type AutomationTrigger = 'new_lead' | 'stage_change' | 'task_completed' | 'client_inactive';
export type AutomationAction = 'create_task' | 'send_notification' | 'assign_user' | 'change_stage';

export interface User {
  id: string; name: string; email: string; avatar: string;
  role: UserRole; department: string; phone: string;
  status: 'online' | 'offline' | 'ausente'; createdAt: string;
}

export interface Client {
  id: string; firstName: string; lastName: string; email: string;
  phone: string; company: string; position: string; address: string;
  city: string; country: string; status: ClientStatus; source: LeadSource;
  tags: string[]; value: number; notes: string; assignedTo: string;
  createdAt: string; updatedAt: string; lastActivity: string;
}

export interface Opportunity {
  id: string; title: string; clientId: string; clientName: string;
  value: number; stage: OpportunityStage; probability: number;
  assignedTo: string; assignedName: string; expectedCloseDate: string;
  createdAt: string; updatedAt: string; description: string;
}

export interface Task {
  id: string; title: string; description: string; assignedTo: string;
  assignedName: string; clientId?: string; clientName?: string;
  priority: Priority; status: TaskStatus; dueDate: string;
  createdAt: string; tags: string[];
}

export interface Activity {
  id: string; type: ActivityType; title: string; description: string;
  clientId: string; clientName: string; userId: string; userName: string;
  createdAt: string; metadata?: Record<string, unknown>;
}

export interface Note {
  id: string; title: string; content: string; clientId?: string;
  clientName?: string; createdBy: string; createdByName: string;
  createdAt: string; updatedAt: string; tags: string[]; isPinned: boolean;
}

export interface CalendarEvent {
  id: string; title: string; description: string;
  type: 'reunion' | 'seguimiento' | 'llamada' | 'evento';
  date: string; startTime: string; endTime: string;
  clientId?: string; clientName?: string; assignedTo: string;
  assignedName: string; color: string;
}

export interface Notification {
  id: string; type: NotificationType; title: string; message: string;
  read: boolean; createdAt: string; link?: string;
}

export interface Automation {
  id: string; name: string; description: string;
  trigger: AutomationTrigger; action: AutomationAction;
  isActive: boolean; createdAt: string; runCount: number;
}

export interface AIInsight {
  id: string; type: 'prediction' | 'suggestion' | 'summary' | 'alert';
  title: string; description: string; confidence: number;
  clientId?: string; clientName?: string; createdAt: string;
}

export interface KPIData {
  label: string; value: string | number; change: number;
  changeLabel: string; icon: string;
}

export interface ChartDataPoint {
  name: string; value: number; value2?: number;
}