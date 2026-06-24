import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('es-ES').format(value);
}

export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(dateStr));
}

export function formatDateTime(dateStr: string): string {
  return new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(dateStr));
}

export function getInitials(name: string): string {
  return name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
}

export function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (seconds < 60) return 'Hace un momento';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `Hace ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Hace ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `Hace ${days}d`;
  return formatDate(dateStr);
}

export const stageColors: Record<string, string> = {
  lead: '#94a3b8', contactado: '#60a5fa', calificado: '#a78bfa',
  reunion: '#f59e0b', propuesta: '#f97316', negociacion: '#6366f1',
  ganado: '#10b981', perdido: '#ef4444',
};

export const stageLabels: Record<string, string> = {
  lead: 'Lead', contactado: 'Contactado', calificado: 'Calificado',
  reunion: 'Reunión', propuesta: 'Propuesta', negociacion: 'Negociación',
  ganado: 'Ganado', perdido: 'Perdido',
};

export const priorityColors: Record<string, string> = {
  urgente: '#ef4444', alta: '#f97316', media: '#f59e0b', baja: '#6b7280',
};

export const statusColors: Record<string, string> = {
  activo: '#10b981', inactivo: '#6b7280', potencial: '#3b82f6', perdido: '#ef4444',
};

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}