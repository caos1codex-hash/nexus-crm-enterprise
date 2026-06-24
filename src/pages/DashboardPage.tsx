import { useAppStore, useCRMStore } from '@/store/appStore';
import { cn, formatCurrency, timeAgo } from '@/lib/utils';
import { kpiData, monthlySalesData, pipelineData, teamPerformanceData } from '@/data/mockData';
import { motion } from 'framer-motion';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, Target, DollarSign, BarChart3, Activity, ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const iconMap: Record<string, React.ComponentType<{className?:string}>> = {
  'trending-up': TrendingUp, 'users': Users, 'target': Target, 'dollar-sign': DollarSign, 'bar-chart': BarChart3, 'activity': Activity,
};
const PC = ['#94a3b8','#60a5fa','#a78bfa','#f59e0b','#f97316','#6366f1','#10b981','#ef4444'];

export function DashboardPage() {
  const { theme } = useAppStore();
  const { activities } = useCRMStore();
  const navigate = useNavigate();
  const gc = theme==='dark'?'rgba(148,163,184,0.08)':'rgba(0,0,0,0.06)';
  const tc = theme==='dark'?'#94a3b8':'#64748b';
  const tb = theme==='dark'?'#1e293b':'#ffffff';
  const tbo = theme==='dark'?'#334155':'#e2e8f0';

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Dashboard Ejecutivo</h2>
        <p className="text-muted-foreground text-sm mt-1">Resumen general de rendimiento comercial — Junio 2026</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpiData.map((kpi,i)=>{
          const Icon=iconMap[kpi.icon]||Activity;
          const pos=kpi.change>=0;
          return(
            <motion.div key={kpi.label} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:i*0.05,duration:0.3}} className="bg-card border border-border rounded-xl p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center"><Icon className="w-4.5 h-4.5 text-primary"/></div>
                <span className={cn("flex items-center gap-0.5 text-xs font-semibold",pos?"text-success":"text-destructive")}>{pos?<ArrowUpRight className="w-3 h-3"/>:<ArrowDownRight className="w-3 h-3"/>}{Math.abs(kpi.change)}%</span>
              </div>
              <p className="text-2xl font-bold tracking-tight">{kpi.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{kpi.label}</p>
              <p className="text-[10px] text-muted-foreground/70 mt-0.5">{kpi.changeLabel}</p>
            </motion.div>
          );
        })}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.2}} className="xl:col-span-2 bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div><h3 className="text-base font-semibold">Evolución de Ventas</h3><p className="text-xs text-muted-foreground mt-0.5">Comparativa mensual 12 meses</p></div>
            <div className="flex items-center gap-4 text-xs"><span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-primary"/>Este período</span><span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-primary/30"/>Período anterior</span></div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={monthlySalesData} margin={{top:5,right:5,bottom:5,left:5}}>
              <defs><linearGradient id="cv" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.15}/><stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gc}/><XAxis dataKey="name" tick={{fontSize:12,fill:tc}} axisLine={false} tickLine={false}/><YAxis tick={{fontSize:12,fill:tc}} axisLine={false} tickLine={false} tickFormatter={v=>`$${v/1000}K`}/>
              <Tooltip contentStyle={{backgroundColor:tb,border:`1px solid ${tbo}`,borderRadius:8,fontSize:13}} formatter={(v:any)=>formatCurrency(Number(v))}/>
              <Area type="monotone" dataKey="value" stroke="var(--color-primary)" strokeWidth={2.5} fill="url(#cv)" name="Este período"/>
              <Area type="monotone" dataKey="value2" stroke="var(--color-primary)" strokeWidth={1.5} strokeOpacity={0.3} fill="none" name="Período anterior" strokeDasharray="5 5"/>
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
        <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.25}} className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-base font-semibold mb-1">Distribución del Pipeline</h3><p className="text-xs text-muted-foreground mb-4">Por etapa de venta</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart><Pie data={pipelineData.filter(d=>d.stage!=='Perdido')} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value" nameKey="stage">{pipelineData.filter(d=>d.stage!=='Perdido').map((_,i)=><Cell key={i} fill={PC[i]}/>)}</Pie><Tooltip contentStyle={{backgroundColor:tb,border:`1px solid ${tbo}`,borderRadius:8,fontSize:13}} formatter={(v:any)=>formatCurrency(Number(v))}/></PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-2">{pipelineData.filter(d=>d.stage!=='Perdido').map((d,i)=>(<div key={d.stage} className="flex items-center gap-2 text-xs"><span className="w-2 h-2 rounded-full flex-shrink-0" style={{backgroundColor:PC[i]}}/><span className="text-muted-foreground truncate">{d.stage}</span><span className="ml-auto font-medium">{d.count}</span></div>))}</div>
        </motion.div>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.3}} className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-base font-semibold mb-1">Rendimiento del Equipo</h3><p className="text-xs text-muted-foreground mb-4">Ingresos por vendedor</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={teamPerformanceData} margin={{top:5,right:5,bottom:5,left:5}}><CartesianGrid strokeDasharray="3 3" stroke={gc}/><XAxis dataKey="name" tick={{fontSize:12,fill:tc}} axisLine={false} tickLine={false}/><YAxis tick={{fontSize:12,fill:tc}} axisLine={false} tickLine={false} tickFormatter={v=>`$${v/1000}K`}/><Tooltip contentStyle={{backgroundColor:tb,border:`1px solid ${tbo}`,borderRadius:8,fontSize:13}} formatter={(v:any)=>formatCurrency(Number(v))}/><Bar dataKey="revenue" fill="var(--color-primary)" radius={[4,4,0,0]} name="Ingresos"/></BarChart>
          </ResponsiveContainer>
        </motion.div>
        <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.35}} className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4"><div><h3 className="text-base font-semibold">Actividad Reciente</h3><p className="text-xs text-muted-foreground mt-0.5">Últimas interacciones del equipo</p></div><button onClick={()=>navigate('/clients')} className="text-xs text-primary font-medium hover:underline">Ver todo</button></div>
          <div className="space-y-4 max-h-[310px] overflow-y-auto pr-1">
            {activities.slice(0,8).map(a=>(
              <div key={a.id} className="flex items-start gap-3">
                <div className={cn("w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-semibold mt-0.5",a.type==='llamada'?'bg-green-500/15 text-green-500':a.type==='email'?'bg-blue-500/15 text-blue-500':a.type==='reunion'?'bg-purple-500/15 text-purple-500':a.type==='nota'?'bg-amber-500/15 text-amber-500':'bg-indigo-500/15 text-indigo-500')}>{a.userName.split(' ').map(n=>n[0]).slice(0,2).join('')}</div>
                <div className="min-w-0 flex-1"><p className="text-sm"><span className="font-medium">{a.userName}</span> <span className="text-muted-foreground">—</span> <span className="text-muted-foreground">{a.title}</span></p><p className="text-xs text-muted-foreground/70 mt-0.5">{a.clientName}</p></div>
                <span className="text-[11px] text-muted-foreground/60 flex-shrink-0 flex items-center gap-1"><Clock className="w-3 h-3"/>{timeAgo(a.createdAt)}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}