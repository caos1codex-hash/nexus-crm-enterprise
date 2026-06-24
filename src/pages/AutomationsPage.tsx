import { useCRMStore } from '@/store/appStore';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Zap, Play, Pause, ArrowRight, BarChart3, Send, UserPlus, GitBranch, Clock, AlertCircle, Plus } from 'lucide-react';

const triggerLabels:Record<string,string> = {new_lead:'Nuevo Lead',stage_change:'Cambio de Etapa',task_completed:'Tarea Completada',client_inactive:'Cliente Inactivo'};
const actionLabels:Record<string,string> = {create_task:'Crear Tarea',send_notification:'Enviar Notificación',assign_user:'Asignar Usuario',change_stage:'Cambiar Etapa'};
const triggerIcons:Record<string,React.ReactNode> = {new_lead:<UserPlus className="w-4 h-4"/>,stage_change:<GitBranch className="w-4 h-4"/>,task_completed:<BarChart3 className="w-4 h-4"/>,client_inactive:<Clock className="w-4 h-4"/>};
const actionIcons:Record<string,React.ReactNode> = {create_task:<Plus className="w-4 h-4"/>,send_notification:<Send className="w-4 h-4"/>,assign_user:<UserPlus className="w-4 h-4"/>,change_stage:<GitBranch className="w-4 h-4"/>};

export function AutomationsPage() {
  const { automations, toggleAutomation } = useCRMStore();
  const activeCount = automations.filter(a=>a.isActive).length;
  const totalRuns = automations.reduce((s,a)=>s+a.runCount,0);

  return (
    <div className="p-6 lg:p-8 max-w-[1200px] mx-auto animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-bold tracking-tight">Automatizaciones</h2><p className="text-muted-foreground text-sm mt-1">{activeCount} activas · {totalRuns} ejecuciones totales</p></div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"><Plus className="w-4 h-4"/>Nueva Regla</button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-xl p-5"><div className="flex items-center gap-3 mb-3"><div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center"><Play className="w-5 h-5 text-green-500"/></div><div><p className="text-2xl font-bold">{activeCount}</p><p className="text-xs text-muted-foreground">Reglas activas</p></div></div></div>
        <div className="bg-card border border-border rounded-xl p-5"><div className="flex items-center gap-3 mb-3"><div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><Zap className="w-5 h-5 text-primary"/></div><div><p className="text-2xl font-bold">{totalRuns}</p><p className="text-xs text-muted-foreground">Ejecuciones totales</p></div></div></div>
      </div>
      <div className="space-y-3">
        {automations.map((a,i)=>(
          <motion.div key={a.id} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*0.05}} className="bg-card border border-border rounded-xl p-5 hover:shadow-sm transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div><h3 className="text-sm font-semibold">{a.name}</h3><p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{a.description}</p></div>
              <button onClick={()=>toggleAutomation(a.id)} className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex-shrink-0 ml-4",a.isActive?"bg-green-500/10 text-green-600 hover:bg-green-500/20":"bg-muted text-muted-foreground hover:bg-muted/80")}>{a.isActive?<><Play className="w-3 h-3"/>Activa</>:<><Pause className="w-3 h-3"/>Pausada</>}</button>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 text-xs font-medium flex-1"><div className="w-6 h-6 rounded-full bg-primary/15 text-primary flex items-center justify-center">{triggerIcons[a.trigger]}</div><span>{triggerLabels[a.trigger]}</span></div>
              <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0"/>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/5 text-xs font-medium text-primary flex-1"><div className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center">{actionIcons[a.action]}</div><span>{actionLabels[a.action]}</span></div>
              <div className="text-right flex-shrink-0"><p className="text-xs text-muted-foreground">{a.runCount} ejec.</p></div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}