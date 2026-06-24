import { useAppStore, useCRMStore } from '@/store/appStore';
import { cn, getInitials } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Shield, Users, Palette, Globe, Bell, Database, Key, Building2 } from 'lucide-react';

const roles = [
  {role:'Administrador',desc:'Acceso completo a todos los módulos y configuraciones',count:1,color:'bg-red-500/10 text-red-500'},
  {role:'Supervisor',desc:'Gestión de equipo, reportes y aprobaciones',count:2,color:'bg-amber-500/10 text-amber-500'},
  {role:'Vendedor',desc:'Gestión de clientes, oportunidades y tareas propias',count:4,color:'bg-blue-500/10 text-blue-500'},
  {role:'Invitado',desc:'Acceso de solo lectura a módulos seleccionados',count:1,color:'bg-slate-500/10 text-slate-500'},
];

export function SettingsPage() {
  const { theme } = useAppStore();
  const { users } = useCRMStore();

  return (
    <div className="p-6 lg:p-8 max-w-[1200px] mx-auto animate-fade-in space-y-8">
      <div><h2 className="text-2xl font-bold tracking-tight">Configuración</h2><p className="text-muted-foreground text-sm mt-1">Gestiona tu organización y preferencias</p></div>

      <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6"><Building2 className="w-5 h-5 text-primary"/><h3 className="text-base font-semibold">Organización</h3></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">Nombre de la organización</label><input defaultValue="Nexus CRM Corp" className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"/></div>
          <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">Plan</label><div className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-border bg-muted/30"><span className="text-sm font-medium">Enterprise</span><span className="text-xs px-2 py-0.5 rounded-full bg-primary/15 text-primary font-medium">Activo</span></div></div>
        </div>
      </motion.div>

      <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.05}} className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6"><Shield className="w-5 h-5 text-primary"/><h3 className="text-base font-semibold">Roles y Permisos</h3></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {roles.map(r=>(
            <div key={r.role} className="p-4 rounded-xl border border-border hover:bg-muted/30 transition-colors">
              <div className="flex items-center justify-between mb-1"><span className="text-sm font-semibold">{r.role}</span><span className={cn("text-xs font-medium px-2 py-0.5 rounded-full",r.color)}>{r.count} usuario{r.count!==1?'s':''}</span></div>
              <p className="text-xs text-muted-foreground">{r.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.1}} className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6"><Users className="w-5 h-5 text-primary"/><h3 className="text-base font-semibold">Equipo</h3></div>
        <div className="space-y-2">
          {users.map(u=>(
            <div key={u.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/30 transition-colors">
              <div className="w-9 h-9 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center">{getInitials(u.name)}</div>
              <div className="flex-1 min-w-0"><p className="text-sm font-medium">{u.name}</p><p className="text-xs text-muted-foreground">{u.email}</p></div>
              <span className="text-xs text-muted-foreground hidden sm:block">{u.department}</span>
              <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full capitalize",u.status==='online'?'bg-green-500/15 text-green-500':u.status==='ausente'?'bg-amber-500/15 text-amber-500':'bg-muted text-muted-foreground')}>{u.status}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-muted capitalize">{u.role}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}