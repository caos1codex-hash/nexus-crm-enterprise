import { useAppStore, useCRMStore } from '@/store/appStore';
import { cn, formatCurrency, timeAgo, formatDateTime, formatDate, stageColors, stageLabels, priorityColors, getInitials } from '@/lib/utils';
import { kpiData, monthlySalesData } from '@/data/mockData';
import { motion } from 'framer-motion';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  TrendingUp, Users, Target, DollarSign, BarChart3, Activity,
  ArrowUpRight, ArrowDownRight, Clock, Phone, Video, CheckCircle2,
  AlertTriangle, FileText, Zap, ArrowRight, Calendar, User, ChevronRight,
  PhoneCall, Mail, Flame, Shield, Timer, Circle, Briefcase
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'trending-up': TrendingUp, 'users': Users, 'target': Target, 'dollar-sign': DollarSign,
  'bar-chart': BarChart3, 'activity': Activity,
};

const activityTypeConfig: Record<string, { icon: React.ComponentType<{ className?: string }>; color: string; bg: string }> = {
  llamada: { icon: PhoneCall, color: 'text-emerald-500', bg: 'bg-emerald-500/12' },
  email: { icon: Mail, color: 'text-blue-500', bg: 'bg-blue-500/12' },
  reunion: { icon: Video, color: 'text-violet-500', bg: 'bg-violet-500/12' },
  cambio_estado: { icon: ArrowRight, color: 'text-indigo-500', bg: 'bg-indigo-500/12' },
  tarea: { icon: CheckCircle2, color: 'text-amber-500', bg: 'bg-amber-500/12' },
  nota: { icon: FileText, color: 'text-orange-500', bg: 'bg-orange-500/12' },
  comentario: { icon: User, color: 'text-slate-400', bg: 'bg-slate-500/12' },
};

export function DashboardPage() {
  const { theme } = useAppStore();
  const { clients, opportunities, activities, tasks, calendarEvents, aiInsights, users } = useCRMStore();
  const navigate = useNavigate();

  const gc = theme === 'dark' ? 'rgba(148,163,184,0.06)' : 'rgba(0,0,0,0.04)';
  const tc = theme === 'dark' ? '#64748b' : '#94a3b8';
  const tb = theme === 'dark' ? '#1e293b' : '#ffffff';
  const tbo = theme === 'dark' ? '#334155' : '#e2e8f0';

  // ── Derived data ──
  const pendingTasks = tasks.filter(t => t.status === 'pendiente');
  const urgentTasks = pendingTasks.filter(t => t.priority === 'urgente' || t.priority === 'alta');
  const today = new Date().toISOString().split('T')[0];
  const todayEvents = calendarEvents.filter(e => e.date === today);
  const upcomingEvents = calendarEvents
    .filter(e => e.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime))
    .slice(0, 4);
  const inactiveClients = clients.filter(c => {
    const daysSince = (Date.now() - new Date(c.lastActivity).getTime()) / 86400000;
    return c.status === 'activo' && daysSince > 10;
  }).slice(0, 5);
  const expiringOpps = opportunities
    .filter(o => !['ganado', 'perdido'].includes(o.stage) && o.probability >= 60)
    .sort((a, b) => b.probability - a.probability)
    .slice(0, 5);
  const pendingProposals = opportunities.filter(o => o.stage === 'propuesta');
  const negotiatingOpps = opportunities.filter(o => o.stage === 'negociacion');
  const recentActivities = activities.slice(0, 12);
  const todayActivities = activities.filter(a => {
    const d = new Date(a.createdAt).toISOString().split('T')[0];
    return d === today;
  });
  const totalMonth = 700000;
  const monthAchieved = 565000;
  const monthPct = Math.round((monthAchieved / totalMonth) * 100);
  const daysRemaining = 5;

  // Mini pipeline
  const miniStages = ['lead', 'contactado', 'calificado', 'propuesta', 'negociacion', 'ganado'];
  const miniPipelineData = miniStages.map(stage => {
    const ops = opportunities.filter(o => o.stage === stage);
    return { stage, label: stageLabels[stage], count: ops.length, value: ops.reduce((s, o) => s + o.value, 0) };
  });
  const totalPipelineValue = miniPipelineData.reduce((s, d) => s + d.value, 0);

  // Alerts
  const alerts = [
    ...(urgentTasks.length > 0 ? [{ id: 'a1', type: 'error' as const, icon: Timer, text: `${urgentTasks.length} tarea${urgentTasks.length > 1 ? 's' : ''} urgente${urgentTasks.length > 1 ? 's' : ''} vencida${urgentTasks.length > 1 ? 's' : ''}`, time: 'Requiere acción inmediata' }] : []),
    ...(pendingProposals.length > 0 ? [{ id: 'a2', type: 'warning' as const, icon: FileText, text: `${pendingProposals.length} propuesta${pendingProposals.length > 1 ? 's' : ''} pendiente${pendingProposals.length > 1 ? 's' : ''} de envío`, time: 'Revisar y enviar esta semana' }] : []),
    ...(negotiatingOpps.length > 0 ? [{ id: 'a3', type: 'info' as const, icon: Briefcase, text: `${negotiatingOpps.length} contrato${negotiatingOpps.length > 1 ? 's' : ''} en negociación`, time: 'Seguimiento prioritario' }] : []),
    ...(inactiveClients.length > 0 ? [{ id: 'a4', type: 'warning' as const, icon: Shield, text: `${inactiveClients.length} cliente${inactiveClients.length > 1 ? 's' : ''} sin actividad hace 10+ días`, time: 'Riesgo de abandono' }] : []),
    ...(monthPct < 100 ? [{ id: 'a5', type: 'error' as const, icon: Flame, text: `Objetivo mensual en riesgo — ${monthPct}% alcanzado`, time: `Faltan $${((totalMonth - monthAchieved) / 1000).toFixed(0)}K · ${daysRemaining} días` }] : []),
  ];

  const alertStyles = {
    error: 'border-red-500/30 bg-red-500/5',
    warning: 'border-amber-500/30 bg-amber-500/5',
    info: 'border-blue-500/30 bg-blue-500/5',
  };
  const alertIconStyles = {
    error: 'text-red-500 bg-red-500/10',
    warning: 'text-amber-500 bg-amber-500/10',
    info: 'text-blue-500 bg-blue-500/10',
  };

  // Next meeting
  const nextMeeting = upcomingEvents.find(e => e.type === 'reunion');
  // Next call
  const nextCall = upcomingEvents.find(e => e.type === 'llamada');
  // Last won
  const lastWon = [...opportunities.filter(o => o.stage === 'ganado')].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0];
  // Last added client
  const lastClient = [...clients].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

  return (
    <div className="p-5 lg:p-7 max-w-[1600px] mx-auto space-y-6 animate-fade-in">

      {/* ── HEADER ── */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground font-medium">
            {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
          <h2 className="text-2xl font-bold tracking-tight mt-1">
            Buen día, Alejandro
          </h2>
          <p className="text-muted-foreground text-sm mt-0.5">
            Aquí está tu resumen de acción para hoy.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          {users.filter(u => u.status === 'online').length} miembros en línea · {todayActivities.length} actividades hoy
        </div>
      </div>

      {/* ── KPI STRIP ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {kpiData.map((kpi, i) => {
          const Icon = iconMap[kpi.icon] || Activity;
          const pos = kpi.change >= 0;
          return (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.25 }}
              className="bg-card border border-border rounded-xl p-3.5 hover:shadow-sm transition-all group"
            >
              <div className="flex items-center justify-between mb-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary/8 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <span className={cn(
                  'flex items-center gap-0.5 text-[11px] font-semibold',
                  pos ? 'text-emerald-500' : 'text-red-500'
                )}>
                  {pos ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {Math.abs(kpi.change)}%
                </span>
              </div>
              <p className="text-xl font-bold tracking-tight">{kpi.value}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{kpi.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* ── CENTRO DE ACCIÓN (PRIMARY SECTION) ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-card border border-border rounded-2xl p-5 lg:p-6"
      >
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Zap className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="text-base font-bold">Centro de Acción</h3>
            <p className="text-xs text-muted-foreground">¿Qué debes hacer hoy?</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {/* Pending follow-ups */}
          <button
            onClick={() => navigate('/tasks')}
            className="flex items-center gap-3.5 p-3.5 rounded-xl border border-border hover:bg-muted/40 transition-colors text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 text-amber-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold">{pendingTasks.length} seguimientos pendientes</p>
              <p className="text-xs text-muted-foreground mt-0.5">{urgentTasks.length} urgentes · {pendingTasks.filter(t => t.priority === 'media').length} regulares</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" />
          </button>

          {/* Upcoming meetings */}
          <button
            onClick={() => navigate('/calendar')}
            className="flex items-center gap-3.5 p-3.5 rounded-xl border border-border hover:bg-muted/40 transition-colors text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center flex-shrink-0">
              <Video className="w-5 h-5 text-violet-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold">{todayEvents.length} reuniones hoy</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {nextMeeting ? `Próxima: ${nextMeeting.startTime} — ${nextMeeting.clientName}` : 'Sin reuniones programadas'}
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" />
          </button>

          {/* Inactive clients */}
          <button
            onClick={() => navigate('/clients')}
            className="flex items-center gap-3.5 p-3.5 rounded-xl border border-border hover:bg-muted/40 transition-colors text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-red-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold">{inactiveClients.length} clientes sin contacto reciente</p>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">
                {inactiveClients[0]?.company}, {inactiveClients[1]?.company}{inactiveClients.length > 2 ? ` y ${inactiveClients.length - 2} más` : ''}
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" />
          </button>

          {/* Pending proposals */}
          <button
            onClick={() => navigate('/pipeline')}
            className="flex items-center gap-3.5 p-3.5 rounded-xl border border-border hover:bg-muted/40 transition-colors text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-blue-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold">{pendingProposals.length} propuestas por enviar</p>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">
                {pendingProposals[0]?.clientName}, {pendingProposals[1]?.clientName}{pendingProposals.length > 2 ? ` y ${pendingProposals.length - 2} más` : ''}
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" />
          </button>

          {/* Contracts in negotiation */}
          <button
            onClick={() => navigate('/pipeline')}
            className="flex items-center gap-3.5 p-3.5 rounded-xl border border-border hover:bg-muted/40 transition-colors text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
              <Briefcase className="w-5 h-5 text-indigo-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold">{negotiatingOpps.length} contratos pendientes</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Valor total: {formatCurrency(negotiatingOpps.reduce((s, o) => s + o.value, 0))}
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" />
          </button>

          {/* Critical opportunities */}
          <button
            onClick={() => navigate('/ai')}
            className="flex items-center gap-3.5 p-3.5 rounded-xl border border-border hover:bg-muted/40 transition-colors text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold">{aiInsights.filter(i => i.type === 'alert').length} oportunidades críticas</p>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">
                {aiInsights.find(i => i.type === 'alert')?.title?.split('—')[0]?.trim()}
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" />
          </button>
        </div>
      </motion.div>

      {/* ── MIDDLE ROW: Commercial Objectives + Top Opportunities + Mini Pipeline ── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">

        {/* Commercial Objectives */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="xl:col-span-4 bg-card border border-border rounded-2xl p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold">Objetivo Mensual</h3>
            <span className="text-[11px] text-muted-foreground font-medium">Junio 2026</span>
          </div>

          <div className="mb-4">
            <div className="flex items-end justify-between mb-2">
              <span className="text-2xl font-bold">{formatCurrency(monthAchieved)}</span>
              <span className="text-sm text-muted-foreground">de {formatCurrency(totalMonth)}</span>
            </div>
            <div className="h-2.5 rounded-full bg-muted overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${monthPct}%` }}
                transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
                className={cn(
                  'h-full rounded-full',
                  monthPct >= 80 ? 'bg-emerald-500' : monthPct >= 50 ? 'bg-amber-500' : 'bg-red-500'
                )}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">
              Faltan <span className="font-semibold text-foreground">{formatCurrency(totalMonth - monthAchieved)}</span> para la meta
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border">
            <div>
              <p className="text-xs text-muted-foreground">Ventas logradas</p>
              <p className="text-sm font-bold mt-0.5 text-emerald-500">{formatCurrency(monthAchieved)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Meta restante</p>
              <p className="text-sm font-bold mt-0.5">{formatCurrency(totalMonth - monthAchieved)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Días restantes</p>
              <p className="text-sm font-bold mt-0.5">{daysRemaining} <span className="text-muted-foreground font-normal text-xs">hábiles</span></p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Ritmo diario</p>
              <p className="text-sm font-bold mt-0.5">{formatCurrency(Math.round((totalMonth - monthAchieved) / daysRemaining))}/día</p>
            </div>
          </div>
        </motion.div>

        {/* Top Opportunities */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="xl:col-span-4 bg-card border border-border rounded-2xl p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold">Top Oportunidades</h3>
            <button onClick={() => navigate('/pipeline')} className="text-xs text-primary font-medium hover:underline">Ver pipeline</button>
          </div>

          <div className="space-y-2.5">
            {expiringOpps.map((opp, i) => (
              <button
                key={opp.id}
                onClick={() => navigate(`/clients/${opp.clientId}`)}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted/40 transition-colors text-left group"
              >
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
                  style={{ backgroundColor: `${stageColors[opp.stage]}15`, color: stageColors[opp.stage] }}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">{opp.clientName}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{opp.title}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold">{formatCurrency(opp.value)}</p>
                  <div className="flex items-center justify-end gap-1">
                    <div className="w-12 h-1 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${opp.probability}%` }} />
                    </div>
                    <span className="text-[10px] text-muted-foreground font-medium w-7 text-right">{opp.probability}%</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Mini Pipeline */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="xl:col-span-4 bg-card border border-border rounded-2xl p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold">Pipeline Compacto</h3>
            <span className="text-xs text-muted-foreground">{formatCurrency(totalPipelineValue)}</span>
          </div>

          <div className="space-y-2">
            {miniPipelineData.map((d) => {
              const pct = totalPipelineValue > 0 ? (d.value / totalPipelineValue) * 100 : 0;
              return (
                <div key={d.stage} className="group">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: stageColors[d.stage] }} />
                      <span className="text-xs font-medium">{d.label}</span>
                      <span className="text-[10px] text-muted-foreground">{d.count}</span>
                    </div>
                    <span className="text-xs font-semibold">{formatCurrency(d.value)}</span>
                  </div>
                  <div className="h-1 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.6, delay: 0.3 + miniPipelineData.indexOf(d) * 0.05 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: stageColors[d.stage] }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Conversión global</span>
            <span className="text-xs font-bold text-primary">
              {miniPipelineData.find(d => d.stage === 'ganado')?.count || 0} / {opportunities.filter(o => !['perdido'].includes(o.stage)).length}
              {' '}({Math.round(((miniPipelineData.find(d => d.stage === 'ganado')?.count || 0) / opportunities.filter(o => !['perdido'].includes(o.stage)).length) * 100)}%)
            </span>
          </div>
        </motion.div>
      </div>

      {/* ── ALERTS CENTER ── */}
      {alerts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-card border border-border rounded-2xl p-5"
        >
          <div className="flex items-center gap-2.5 mb-4">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-bold">Centro de Alertas</h3>
            <span className="text-[10px] font-semibold bg-amber-500/15 text-amber-600 px-2 py-0.5 rounded-full">{alerts.length}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2.5">
            {alerts.map(alert => {
              const AIcon = alert.icon;
              return (
                <div
                  key={alert.id}
                  className={cn('flex items-center gap-3 p-3 rounded-xl border', alertStyles[alert.type])}
                >
                  <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0', alertIconStyles[alert.type])}>
                    <AIcon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold">{alert.text}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{alert.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* ── AI RECOMMENDATIONS ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-card border border-border rounded-2xl p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary/20 to-violet-500/20 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Recomendaciones IA</h3>
              <p className="text-[11px] text-muted-foreground">Insights generados para tu equipo</p>
            </div>
          </div>
          <button onClick={() => navigate('/ai')} className="text-xs text-primary font-medium hover:underline">Ver todas</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {aiInsights.slice(0, 3).map(insight => {
            const isAlert = insight.type === 'alert';
            const isSuggestion = insight.type === 'suggestion';
            return (
              <button
                key={insight.id}
                onClick={() => insight.clientId && navigate(`/clients/${insight.clientId}`)}
                className="text-left p-4 rounded-xl border border-border hover:bg-muted/30 transition-colors group"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className={cn(
                    'text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full',
                    isAlert ? 'bg-red-500/10 text-red-500' : isSuggestion ? 'bg-amber-500/10 text-amber-600' : 'bg-blue-500/10 text-blue-500'
                  )}>
                    {isAlert ? 'Alerta' : isSuggestion ? 'Sugerencia' : 'Predicción'}
                  </span>
                  <span className="text-[10px] text-muted-foreground ml-auto">{insight.confidence}% confianza</span>
                </div>
                <p className="text-xs font-semibold leading-snug mb-1.5 group-hover:text-primary transition-colors">{insight.title}</p>
                <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-3">{insight.description}</p>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* ── CHART + REALISTIC ACTIVITY (charts ≤30%) ── */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">

        {/* Chart — only 2/5 width */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="xl:col-span-2 bg-card border border-border rounded-2xl p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold">Evolución de Ventas</h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">12 meses</p>
            </div>
            <div className="flex items-center gap-3 text-[10px]">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary" />Este período</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary/30" />Anterior</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlySalesData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
              <defs>
                <linearGradient id="cv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gc} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: tc }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: tc }} axisLine={false} tickLine={false} tickFormatter={v => `$${v / 1000}K`} />
              <Tooltip
                contentStyle={{ backgroundColor: tb, border: `1px solid ${tbo}`, borderRadius: 8, fontSize: 12 }}
                formatter={(v: any) => formatCurrency(Number(v))}
              />
              <Area type="monotone" dataKey="value" stroke="var(--color-primary)" strokeWidth={2} fill="url(#cv)" name="Este período" />
              <Area type="monotone" dataKey="value2" stroke="var(--color-primary)" strokeWidth={1.5} strokeOpacity={0.3} fill="none" name="Período anterior" strokeDasharray="5 5" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Realistic Activity Feed — 3/5 width */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="xl:col-span-3 bg-card border border-border rounded-2xl p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold">Actividad del Equipo</h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">{todayActivities.length} acciones hoy · {activities.length} registradas</p>
            </div>
            <button onClick={() => navigate('/clients')} className="text-xs text-primary font-medium hover:underline">Ver todo</button>
          </div>
          <div className="space-y-1 max-h-[300px] overflow-y-auto pr-1">
            {recentActivities.map((a) => {
              const cfg = activityTypeConfig[a.type];
              const AIcon = cfg?.icon || Activity;
              return (
                <div key={a.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors">
                  <div className={cn('w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5', cfg?.bg || 'bg-muted')}>
                    <AIcon className={cn('w-3.5 h-3.5', cfg?.color || 'text-muted-foreground')} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs leading-relaxed">
                      <span className="font-semibold">{a.userName}</span>
                      {' '}
                      <span className="text-muted-foreground">—</span>
                      {' '}
                      <span className="text-muted-foreground">{a.title}</span>
                    </p>
                    <p className="text-[10px] text-muted-foreground/60 mt-0.5">
                      {formatDateTime(a.createdAt)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* ── HUMAN DASHBOARD: Next events strip ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3"
      >
        {/* Next Meeting */}
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Video className="w-3.5 h-3.5 text-violet-500" />
            <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Próxima reunión</span>
          </div>
          {nextMeeting ? (
            <>
              <p className="text-sm font-semibold truncate">{nextMeeting.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{nextMeeting.startTime} — {nextMeeting.clientName}</p>
            </>
          ) : (
            <p className="text-xs text-muted-foreground">Sin reuniones programadas</p>
          )}
        </div>

        {/* Next Call */}
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Phone className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Próxima llamada</span>
          </div>
          {nextCall ? (
            <>
              <p className="text-sm font-semibold truncate">{nextCall.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{nextCall.startTime} — {nextCall.clientName}</p>
            </>
          ) : (
            <p className="text-xs text-muted-foreground">Sin llamadas programadas</p>
          )}
        </div>

        {/* Last Won Deal */}
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Último cierre</span>
          </div>
          {lastWon ? (
            <>
              <p className="text-sm font-semibold truncate">{lastWon.clientName}</p>
              <p className="text-xs text-emerald-500 font-medium mt-0.5">{formatCurrency(lastWon.value)}</p>
            </>
          ) : (
            <p className="text-xs text-muted-foreground">Sin cierres recientes</p>
          )}
        </div>

        {/* Last Client Added */}
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <User className="w-3.5 h-3.5 text-blue-500" />
            <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Último cliente</span>
          </div>
          {lastClient ? (
            <>
              <p className="text-sm font-semibold truncate">{lastClient.company}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{lastClient.firstName} {lastClient.lastName} · {lastClient.city}</p>
            </>
          ) : (
            <p className="text-xs text-muted-foreground">Sin clientes nuevos</p>
          )}
        </div>
      </motion.div>

    </div>
  );
}