import { useParams, useNavigate } from 'react-router-dom';
import { useCRMStore } from '@/store/appStore';
import { cn, formatCurrency, formatDate, getInitials, statusColors, stageColors, stageLabels, timeAgo } from '@/lib/utils';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Phone, MapPin, Tag, Calendar, FileText, MessageSquare, PhoneCall, Video, ArrowRight, Edit, Trash2, CheckCircle } from 'lucide-react';

const activityIconMap: Record<string, React.ReactNode> = {
  llamada: <PhoneCall className="w-3.5 h-3.5" />,
  email: <Mail className="w-3.5 h-3.5" />,
  reunion: <Video className="w-3.5 h-3.5" />,
  nota: <FileText className="w-3.5 h-3.5" />,
  cambio_estado: <ArrowRight className="w-3.5 h-3.5" />,
  tarea: <CheckCircle className="w-3.5 h-3.5" />,
  comentario: <MessageSquare className="w-3.5 h-3.5" />,
};

export function ClientProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { clients, activities, opportunities, tasks } = useCRMStore();
  const client = clients.find(c => c.id === id);

  if (!client) {
    return <div className="p-8 text-center text-muted-foreground">Cliente no encontrado</div>;
  }

  const clientOps = opportunities.filter(o => o.clientId === client.id);
  const clientTasks = tasks.filter(t => t.clientId === client.id);
  const clientActivities = activities.filter(a => a.clientId === client.id);
  const totalOpValue = clientOps.reduce((s, o) => s + o.value, 0);

  const statusBg = `${statusColors[client.status]}15`;

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto animate-fade-in space-y-6">
      <button onClick={() => navigate('/clients')} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" />Volver a Clientes
      </button>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent relative">
          <div className="absolute -bottom-10 left-6">
            <div className="w-20 h-20 rounded-2xl bg-card border-4 border-card shadow-lg flex items-center justify-center text-xl font-bold text-primary">
              {getInitials(`${client.firstName} ${client.lastName}`)}
            </div>
          </div>
        </div>
        <div className="pt-14 px-6 pb-6">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-xl font-bold">{client.firstName} {client.lastName}</h2>
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium"
                  style={{ backgroundColor: statusBg, color: statusColors[client.status] }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusColors[client.status] }} />
                  {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                </span>
              </div>
              <p className="text-muted-foreground text-sm">{client.position} en {client.company}</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-3.5 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors">
                <Edit className="w-3.5 h-3.5" />Editar
              </button>
              <button className="flex items-center gap-2 px-3.5 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted text-destructive transition-colors">
                <Trash2 className="w-3.5 h-3.5" />Eliminar
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
              <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Email</p>
                <p className="text-sm font-medium truncate mt-0.5">{client.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
              <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Teléfono</p>
                <p className="text-sm font-medium truncate mt-0.5">{client.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
              <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Ubicación</p>
                <p className="text-sm font-medium truncate mt-0.5">{client.city}, {client.country}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
              <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Creación</p>
                <p className="text-sm font-medium truncate mt-0.5">{formatDate(client.createdAt)}</p>
              </div>
            </div>
          </div>

          {client.tags.length > 0 && (
            <div className="flex items-center gap-2 mt-4 flex-wrap">
              <Tag className="w-3.5 h-3.5 text-muted-foreground" />
              {client.tags.map(t => (
                <span key={t} className="px-2.5 py-0.5 rounded-full bg-muted text-xs font-medium text-muted-foreground">{t}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Valor Comercial', value: formatCurrency(client.value), color: 'text-primary' },
          { label: 'Oportunidades', value: clientOps.length.toString(), color: 'text-foreground' },
          { label: 'Pipeline Activo', value: formatCurrency(totalOpValue), color: 'text-primary' },
          { label: 'Tareas Activas', value: clientTasks.filter(t => t.status !== 'completada').length.toString(), color: 'text-foreground' },
        ].map(k => (
          <motion.div key={k.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-xl p-4">
            <p className="text-xs text-muted-foreground mb-1">{k.label}</p>
            <p className={cn('text-xl font-bold', k.color)}>{k.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="text-sm font-semibold">Oportunidades ({clientOps.length})</h3>
          </div>
          <div className="divide-y divide-border/50 max-h-[400px] overflow-y-auto">
            {clientOps.map(o => {
              const stgBg = `${stageColors[o.stage]}15`;
              return (
                <div key={o.id} className="px-5 py-3.5 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-sm font-medium">{o.title}</p>
                    <span className="text-sm font-semibold">{formatCurrency(o.value)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: stgBg, color: stageColors[o.stage] }}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: stageColors[o.stage] }} />
                      {stageLabels[o.stage]}
                    </span>
                    <span className="text-xs text-muted-foreground">Cierre: {formatDate(o.expectedCloseDate)}</span>
                  </div>
                </div>
              );
            })}
            {clientOps.length === 0 && <div className="px-5 py-8 text-center text-sm text-muted-foreground">Sin oportunidades</div>}
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="text-sm font-semibold">Timeline ({clientActivities.length})</h3>
          </div>
          <div className="max-h-[400px] overflow-y-auto px-5 py-4">
            <div className="relative space-y-6 before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-px before:bg-border">
              {clientActivities.map(a => (
                <div key={a.id} className="relative flex gap-4 pl-10">
                  <div className={cn(
                    'absolute left-0 top-0.5 w-[30px] h-[30px] rounded-full flex items-center justify-center text-xs',
                    a.type === 'llamada' ? 'bg-green-500/15 text-green-500' :
                    a.type === 'email' ? 'bg-blue-500/15 text-blue-500' :
                    a.type === 'reunion' ? 'bg-purple-500/15 text-purple-500' :
                    'bg-muted text-muted-foreground'
                  )}>
                    {activityIconMap[a.type]}
                  </div>
                  <div className="flex-1 min-w-0 pb-1">
                    <p className="text-sm font-medium">{a.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{a.description}</p>
                    <p className="text-[11px] text-muted-foreground/60 mt-1">{a.userName} · {timeAgo(a.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
            {clientActivities.length === 0 && <div className="py-8 text-center text-sm text-muted-foreground">Sin actividades</div>}
          </div>
        </div>
      </div>
    </div>
  );
}