import { useAppStore, useCRMStore } from '@/store/appStore';
import { cn, formatCurrency } from '@/lib/utils';
import { motion } from 'framer-motion';
import { monthlySalesData, pipelineData, teamPerformanceData } from '@/data/mockData';
import { BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';
import { Download, TrendingUp, Users, Target, DollarSign } from 'lucide-react';

const PIPELINE_COLORS = ['#94a3b8','#60a5fa','#a78bfa','#f59e0b','#f97316','#6366f1','#10b981','#ef4444'];

export function ReportsPage() {
  const { theme } = useAppStore();
  const { clients, opportunities } = useCRMStore();
  const gc = theme==='dark'?'rgba(148,163,184,0.08)':'rgba(0,0,0,0.06)';
  const tc = theme==='dark'?'#94a3b8':'#64748b';
  const tb = theme==='dark'?'#1e293b':'#ffffff';
  const tbo = theme==='dark'?'#334155':'#e2e8f0';

  const conversionData = [
    {stage:'Leads',value:clients.length},{stage:'Contactados',value:28},{stage:'Calificados',value:19},
    {stage:'Propuesta',value:12},{stage:'Negociación',value:8},{stage:'Cerrados',value:5},
  ];

  const sourceData = [
    {name:'LinkedIn',value:8,color:'#0077B5'},{name:'Referido',value:6,color:'#10b981'},
    {name:'Evento',value:5,color:'#8b5cf6'},{name:'Web',value:3,color:'#3b82f6'},
    {name:'Cold Call',value:2,color:'#f59e0b'},{name:'Otro',value:1,color:'#6b7280'},
  ];

  const totalRevenue = opportunities.filter(o=>o.stage==='ganado').reduce((s,o)=>s+o.value,0);
  const totalPipeline = opportunities.filter(o=>!['ganado','perdido'].includes(o.stage)).reduce((s,o)=>s+o.value,0);
  const avgDealSize = totalRevenue / (opportunities.filter(o=>o.stage==='ganado').length||1);
  const winRate = opportunities.filter(o=>o.stage==='ganado').length / (opportunities.filter(o=>o.stage==='ganado'||o.stage==='perdido').length||1) * 100;

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto animate-fade-in space-y-6">
      <div className="flex items-center justify-between"><div><h2 className="text-2xl font-bold tracking-tight">Reportes</h2><p className="text-muted-foreground text-sm mt-1">Análisis detallado del rendimiento comercial</p></div><button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors"><Download className="w-4 h-4"/>Exportar</button></div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {icon:DollarSign,label:'Ingresos Cerrados',value:formatCurrency(totalRevenue),color:'text-primary'},
          {icon:Target,label:'Tasa de Cierre',value:`${winRate.toFixed(1)}%`,color:'text-green-500'},
          {icon:DollarSign,label:'Ticket Promedio',value:formatCurrency(avgDealSize),color:'text-amber-500'},
          {icon:Users,label:'Pipeline Total',value:formatCurrency(totalPipeline),color:'text-purple-500'},
        ].map(k=>(<motion.div key={k.label} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="bg-card border border-border rounded-xl p-4"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center"><k.icon className="w-4.5 h-4.5 text-primary"/></div><div><p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">{k.label}</p><p className={cn("text-xl font-bold mt-0.5",k.color)}>{k.value}</p></div></div></motion.div>))}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.1}} className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-base font-semibold mb-1">Tendencia de Ventas</h3><p className="text-xs text-muted-foreground mb-4">Evolución mensual de ingresos</p>
          <ResponsiveContainer width="100%" height={280}><AreaChart data={monthlySalesData}><defs><linearGradient id="rs1" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.2}/><stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke={gc}/><XAxis dataKey="name" tick={{fontSize:12,fill:tc}} axisLine={false} tickLine={false}/><YAxis tick={{fontSize:12,fill:tc}} axisLine={false} tickLine={false} tickFormatter={v=>`$${v/1000}K`}/><Tooltip contentStyle={{backgroundColor:tb,border:`1px solid ${tbo}`,borderRadius:8,fontSize:13}} formatter={(v:any)=>formatCurrency(Number(v))}/><Area type="monotone" dataKey="value" stroke="var(--color-primary)" strokeWidth={2} fill="url(#rs1)"/></AreaChart></ResponsiveContainer>
        </motion.div>
        <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.15}} className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-base font-semibold mb-1">Embudo de Conversión</h3><p className="text-xs text-muted-foreground mb-4">De leads a clientes cerrados</p>
          <ResponsiveContainer width="100%" height={280}><BarChart data={conversionData} layout="vertical" margin={{top:5,right:20,bottom:5,left:5}}><CartesianGrid strokeDasharray="3 3" stroke={gc}/><XAxis type="number" tick={{fontSize:12,fill:tc}} axisLine={false} tickLine={false}/><YAxis type="category" dataKey="stage" tick={{fontSize:12,fill:tc}} axisLine={false} tickLine={false} width={90}/><Tooltip contentStyle={{backgroundColor:tb,border:`1px solid ${tbo}`,borderRadius:8,fontSize:13}}/><Bar dataKey="value" fill="var(--color-primary)" radius={[0,4,4,0]}/></BarChart></ResponsiveContainer>
        </motion.div>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.2}} className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-base font-semibold mb-1">Rendimiento por Vendedor</h3><p className="text-xs text-muted-foreground mb-4">Comparativa de actividad y resultados</p>
          <ResponsiveContainer width="100%" height={280}><BarChart data={teamPerformanceData}><CartesianGrid strokeDasharray="3 3" stroke={gc}/><XAxis dataKey="name" tick={{fontSize:12,fill:tc}} axisLine={false} tickLine={false}/><YAxis tick={{fontSize:12,fill:tc}} axisLine={false} tickLine={false}/><Tooltip contentStyle={{backgroundColor:tb,border:`1px solid ${tbo}`,borderRadius:8,fontSize:13}}/><Legend/><Bar dataKey="deals" fill="var(--color-primary)" radius={[4,4,0,0]} name="Deals"/><Bar dataKey="activities" fill="var(--color-primary)" fillOpacity={0.3} radius={[4,4,0,0]} name="Actividades"/></BarChart></ResponsiveContainer>
        </motion.div>
        <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.25}} className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-base font-semibold mb-1">Fuentes de Leads</h3><p className="text-xs text-muted-foreground mb-4">Distribución por canal de adquisición</p>
          <ResponsiveContainer width="100%" height={280}><PieChart><Pie data={sourceData} cx="50%" cy="50%" outerRadius={100} innerRadius={60} paddingAngle={3} dataKey="value" nameKey="name" label={({name,percent}:any)=>`${name} ${(percent*100).toFixed(0)}%`} labelLine={false}>{sourceData.map((entry,i)=><Cell key={i} fill={entry.color}/>)}</Pie><Tooltip contentStyle={{backgroundColor:tb,border:`1px solid ${tbo}`,borderRadius:8,fontSize:13}}/></PieChart></ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}