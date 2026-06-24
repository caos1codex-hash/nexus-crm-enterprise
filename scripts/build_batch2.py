import os
B = "/home/z/my-project/nexus-crm-enterprise/src"
files = {}

# DASHBOARD PAGE
files["pages/DashboardPage.tsx"] = r"""import { useAppStore, useCRMStore } from '@/store/appStore';
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
              <Tooltip contentStyle={{backgroundColor:tb,border:`1px solid ${tbo}`,borderRadius:8,fontSize:13}} formatter={(v:number)=>formatCurrency(v)}/>
              <Area type="monotone" dataKey="value" stroke="var(--color-primary)" strokeWidth={2.5} fill="url(#cv)" name="Este período"/>
              <Area type="monotone" dataKey="value2" stroke="var(--color-primary)" strokeWidth={1.5} strokeOpacity={0.3} fill="none" name="Período anterior" strokeDasharray="5 5"/>
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
        <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.25}} className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-base font-semibold mb-1">Distribución del Pipeline</h3><p className="text-xs text-muted-foreground mb-4">Por etapa de venta</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart><Pie data={pipelineData.filter(d=>d.stage!=='Perdido')} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value" nameKey="stage">{pipelineData.filter(d=>d.stage!=='Perdido').map((_,i)=><Cell key={i} fill={PC[i]}/>)}</Pie><Tooltip contentStyle={{backgroundColor:tb,border:`1px solid ${tbo}`,borderRadius:8,fontSize:13}} formatter={(v:number)=>formatCurrency(v)}/></PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-2">{pipelineData.filter(d=>d.stage!=='Perdido').map((d,i)=>(<div key={d.stage} className="flex items-center gap-2 text-xs"><span className="w-2 h-2 rounded-full flex-shrink-0" style={{backgroundColor:PC[i]}}/><span className="text-muted-foreground truncate">{d.stage}</span><span className="ml-auto font-medium">{d.count}</span></div>))}</div>
        </motion.div>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.3}} className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-base font-semibold mb-1">Rendimiento del Equipo</h3><p className="text-xs text-muted-foreground mb-4">Ingresos por vendedor</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={teamPerformanceData} margin={{top:5,right:5,bottom:5,left:5}}><CartesianGrid strokeDasharray="3 3" stroke={gc}/><XAxis dataKey="name" tick={{fontSize:12,fill:tc}} axisLine={false} tickLine={false}/><YAxis tick={{fontSize:12,fill:tc}} axisLine={false} tickLine={false} tickFormatter={v=>`$${v/1000}K`}/><Tooltip contentStyle={{backgroundColor:tb,border:`1px solid ${tbo}`,borderRadius:8,fontSize:13}} formatter={(v:number)=>formatCurrency(v)}/><Bar dataKey="revenue" fill="var(--color-primary)" radius={[4,4,0,0]} name="Ingresos"/></BarChart>
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
}"""

# CLIENTS PAGE
files["pages/ClientsPage.tsx"] = r"""import { useState, useMemo } from 'react';
import { useCRMStore } from '@/store/appStore';
import { cn, formatCurrency, formatDate, getInitials, statusColors } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Filter, ArrowUpDown, MoreHorizontal, Eye, Edit, Trash2, Download, X, Building2, Mail, Phone, MapPin } from 'lucide-react';
import { generateId } from '@/lib/utils';
import type { ClientStatus, LeadSource } from '@/types';

const statusOptions: ClientStatus[] = ['activo','inactivo','potencial','perdido'];
const sourceOptions: LeadSource[] = ['web','referido','linkedin','evento','cold_call','otro'];
const sourceLabels: Record<string,string> = {web:'Web',referido:'Referido',linkedin:'LinkedIn',evento:'Evento',cold_call:'Llamada en frío',otro:'Otro'};

export function ClientsPage() {
  const { clients, addClient, deleteClient } = useCRMStore();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [sortField, setSortField] = useState<string>('createdAt');
  const [sortDir, setSortDir] = useState<'asc'|'desc'>('desc');
  const [menuOpen, setMenuOpen] = useState<string|null>(null);
  const [form, setForm] = useState({firstName:'',lastName:'',email:'',phone:'',company:'',position:'',city:'',country:'',status:'potencial' as ClientStatus,source:'web' as LeadSource,value:0,tags:'',notes:''});

  const filtered = useMemo(()=>{
    let list = [...clients];
    if(search) list = list.filter(c=>`${c.firstName} ${c.lastName} ${c.company} ${c.email}`.toLowerCase().includes(search.toLowerCase()));
    if(statusFilter!=='all') list = list.filter(c=>c.status===statusFilter);
    if(sourceFilter!=='all') list = list.filter(c=>c.source===sourceFilter);
    list.sort((a,b)=>{
      const aV = a[sortField as keyof typeof a]; const bV = b[sortField as keyof typeof b];
      if(typeof aV==='number'&&typeof bV==='number') return sortDir==='asc'?aV-bV:bV-aV;
      return sortDir==='asc'?String(aV).localeCompare(String(bV)):String(bV).localeCompare(String(aV));
    });
    return list;
  },[clients,search,statusFilter,sourceFilter,sortField,sortDir]);

  const handleSort = (f:string)=>{
    if(sortField===f) setSortDir(d=>d==='asc'?'desc':'asc');
    else { setSortField(f); setSortDir('asc'); }
  };

  const handleAdd = ()=>{
    addClient({id:generateId(),...form,tags:form.tags?form.tags.split(',').map(t=>t.trim()):[],address:'',assignedTo:'u1',createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),lastActivity:new Date().toISOString()});
    setShowModal(false);
    setForm({firstName:'',lastName:'',email:'',phone:'',company:'',position:'',city:'',country:'',status:'potencial',source:'web',value:0,tags:'',notes:''});
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div><h2 className="text-2xl font-bold tracking-tight">Clientes</h2><p className="text-muted-foreground text-sm mt-1">{clients.length} clientes registrados</p></div>
        <div className="flex items-center gap-2">
          <button onClick={()=>setShowFilters(!showFilters)} className={cn("flex items-center gap-2 px-3.5 py-2 rounded-lg border border-border text-sm transition-colors",(statusFilter!=='all'||sourceFilter!=='all')?'bg-primary/10 border-primary/30 text-primary':'hover:bg-muted text-muted-foreground')}><Filter className="w-4 h-4"/>Filtros{(statusFilter!=='all'||sourceFilter!=='all')&&<span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold">{(statusFilter!=='all'?1:0)+(sourceFilter!=='all'?1:0)}</span>}</button>
          <button onClick={()=>setShowModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"><Plus className="w-4 h-4"/>Nuevo Cliente</button>
        </div>
      </div>
      <AnimatePresence>{showFilters&&(<motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} className="overflow-hidden mb-4"><div className="flex items-center gap-3 p-4 bg-card border border-border rounded-xl"><div className="flex-1"><label className="text-xs font-medium text-muted-foreground mb-1.5 block">Estado</label><select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"><option value="all">Todos</option>{statusOptions.map(s=><option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}</select></div><div className="flex-1"><label className="text-xs font-medium text-muted-foreground mb-1.5 block">Fuente</label><select value={sourceFilter} onChange={e=>setSourceFilter(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"><option value="all">Todas</option>{sourceOptions.map(s=><option key={s} value={s}>{sourceLabels[s]}</option>)}</select></div></div></motion.div>)}</AnimatePresence>
      <div className="relative mb-5"><Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar por nombre, empresa, email..." className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"/></div>
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto"><table className="w-full"><thead><tr className="border-b border-border bg-muted/30"><th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 w-[300px]"><button onClick={()=>handleSort('lastName')} className="flex items-center gap-1 hover:text-foreground transition-colors">Cliente <ArrowUpDown className="w-3 h-3"/></button></th><th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 hidden md:table-cell">Empresa</th><th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 hidden lg:table-cell">Estado</th><th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 hidden xl:table-cell">Fuente</th><th className="text-right text-xs font-semibold text-muted-foreground px-4 py-3 hidden lg:table-cell"><button onClick={()=>handleSort('value')} className="flex items-center gap-1 hover:text-foreground transition-colors ml-auto">Valor <ArrowUpDown className="w-3 h-3"/></button></th><th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 hidden xl:table-cell">Creado</th><th className="w-10 px-4 py-3"></th></tr></thead><tbody>{filtered.map((c,i)=>(<motion.tr key={c.id} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*0.02}} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors group">
          <td className="px-4 py-3"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center flex-shrink-0">{getInitials(`${c.firstName} ${c.lastName}`)}</div><div className="min-w-0"><p className="text-sm font-medium truncate">{c.firstName} {c.lastName}</p><p className="text-xs text-muted-foreground truncate">{c.email}</p></div></div></td>
          <td className="px-4 py-3 hidden md:table-cell"><div className="flex items-center gap-2 text-sm"><Building2 className="w-3.5 h-3.5 text-muted-foreground"/><span className="truncate max-w-[180px]">{c.company}</span></div></td>
          <td className="px-4 py-3 hidden lg:table-cell"><span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium" style={{backgroundColor:`${statusColors[c.status]}15`,color:statusColors[c.status]}}><span className="w-1.5 h-1.5 rounded-full" style={{backgroundColor:statusColors[c.status]}}/>{c.status.charAt(0).toUpperCase()+c.status.slice(1)}</span></td>
          <td className="px-4 py-3 hidden xl:table-cell text-sm text-muted-foreground">{sourceLabels[c.source]||c.source}</td>
          <td className="px-4 py-3 hidden lg:table-cell text-right text-sm font-medium">{formatCurrency(c.value)}</td>
          <td className="px-4 py-3 hidden xl:table-cell text-sm text-muted-foreground">{formatDate(c.createdAt)}</td>
          <td className="px-4 py-3"><div className="relative"><button onClick={()=>setMenuOpen(menuOpen===c.id?null:c.id)} className="p-1.5 rounded-md hover:bg-muted text-muted-foreground opacity-0 group-hover:opacity-100 transition-all"><MoreHorizontal className="w-4 h-4"/></button><AnimatePresence>{menuOpen===c.id&&(<motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.95}} className="absolute right-0 top-full mt-1 w-44 bg-popover border border-border rounded-lg shadow-xl z-20 py-1"><button onClick={()=>{navigate(`/clients/${c.id}`);setMenuOpen(null);}} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-muted transition-colors"><Eye className="w-3.5 h-3.5 text-muted-foreground"/>Ver perfil</button><button onClick={()=>{setMenuOpen(null);}} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-muted transition-colors"><Edit className="w-3.5 h-3.5 text-muted-foreground"/>Editar</button><button onClick={()=>{deleteClient(c.id);setMenuOpen(null);}} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-muted transition-colors text-destructive"><Trash2 className="w-3.5 h-3.5"/>Eliminar</button></motion.div>)}</AnimatePresence></div></td>
        </motion.tr>))}</tbody></table></div>
        {filtered.length===0&&(<div className="py-16 text-center"><p className="text-muted-foreground text-sm">No se encontraron clientes</p></div>)}
      </div>
      <AnimatePresence>{showModal&&(<motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={()=>setShowModal(false)}><motion.div initial={{opacity:0,y:20,scale:0.96}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:20,scale:0.96}} className="w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl" onClick={e=>e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-border"><h3 className="text-lg font-semibold">Nuevo Cliente</h3><button onClick={()=>setShowModal(false)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground"><X className="w-4 h-4"/></button></div>
        <div className="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto"><div className="grid grid-cols-2 gap-4"><div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">Nombre</label><input value={form.firstName} onChange={e=>setForm({...form,firstName:e.target.value})} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"/></div><div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">Apellido</label><input value={form.lastName} onChange={e=>setForm({...form,lastName:e.target.value})} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"/></div></div><div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">Email</label><input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"/></div><div className="grid grid-cols-2 gap-4"><div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">Empresa</label><input value={form.company} onChange={e=>setForm({...form,company:e.target.value})} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"/></div><div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">Cargo</label><input value={form.position} onChange={e=>setForm({...form,position:e.target.value})} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"/></div></div><div className="grid grid-cols-2 gap-4"><div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">Ciudad</label><input value={form.city} onChange={e=>setForm({...form,city:e.target.value})} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"/></div><div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">País</label><input value={form.country} onChange={e=>setForm({...form,country:e.target.value})} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"/></div></div><div className="grid grid-cols-3 gap-4"><div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">Estado</label><select value={form.status} onChange={e=>setForm({...form,status:e.target.value as ClientStatus})} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"><option value="potencial">Potencial</option><option value="activo">Activo</option><option value="inactivo">Inactivo</option><option value="perdido">Perdido</option></select></div><div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">Fuente</label><select value={form.source} onChange={e=>setForm({...form,source:e.target.value as LeadSource})} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm">{sourceOptions.map(s=><option key={s} value={s}>{sourceLabels[s]}</option>)}</select></div><div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">Valor ($)</label><input type="number" value={form.value||''} onChange={e=>setForm({...form,value:Number(e.target.value)})} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"/></div></div><div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">Etiquetas (separadas por coma)</label><input value={form.tags} onChange={e=>setForm({...form,tags:e.target.value})} placeholder="enterprise, tech" className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"/></div></div>
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border"><button onClick={()=>setShowModal(false)} className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors">Cancelar</button><button onClick={handleAdd} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">Crear Cliente</button></div>
      </motion.div></motion.div>)}</AnimatePresence>
    </div>
  );
}"""

# CLIENT PROFILE PAGE
files["pages/ClientProfilePage.tsx"] = r"""import { useParams, useNavigate } from 'react-router-dom';
import { useCRMStore } from '@/store/appStore';
import { cn, formatCurrency, formatDate, formatDateTime, getInitials, statusColors, stageColors, stageLabels, timeAgo } from '@/lib/utils';
import { motion } from 'framer-motion';
import { ArrowLeft, Building2, Mail, Phone, MapPin, Globe, Tag, DollarSign, Clock, Calendar, FileText, MessageSquare, PhoneCall, Video, ArrowRight, Edit, Trash2, Plus, CheckCircle } from 'lucide-react';

export function ClientProfilePage() {
  const { id } = useParams<{id:string}>();
  const navigate = useNavigate();
  const { clients, activities, opportunities, tasks, notes } = useCRMStore();
  const client = clients.find(c=>c.id===id);
  if(!client) return <div className="p-8 text-center text-muted-foreground">Cliente no encontrado</div>;

  const clientOps = opportunities.filter(o=>o.clientId===client.id);
  const clientTasks = tasks.filter(t=>t.clientId===client.id);
  const clientActivities = activities.filter(a=>a.clientId===client.id);
  const clientNotes = notes.filter(n=>n.clientId===client.id);
  const totalOpValue = clientOps.reduce((s,o)=>s+o.value,0);
  const wonOps = clientOps.filter(o=>o.stage==='ganado');
  const activityIcons:Record<string,React.ReactNode> = {llamada:<PhoneCall className="w-3.5 h-3.5"/>,email:<Mail className="w-3.5 h-3.5"/>,reunion:<Video className="w-3.5 h-3.5"/>,nota:<FileText className="w-3.5 h-3.5"/>,cambio_estado:<ArrowRight className="w-3.5 h-3.5"/>,tarea:<CheckCircle className="w-3.5 h-3.5"/>,comentario:<MessageSquare className="w-3.5 h-3.5"/>};

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto animate-fade-in space-y-6">
      <button onClick={()=>navigate('/clients')} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"><ArrowLeft className="w-4 h-4"/>Volver a Clientes</button>
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent relative">
          <div className="absolute -bottom-10 left-6 flex items-end gap-4">
            <div className="w-20 h-20 rounded-2xl bg-card border-4 border-card shadow-lg flex items-center justify-center text-xl font-bold text-primary">{getInitials(`${client.firstName} ${client.lastName}`)}</div>
          </div>
        </div>
        <div className="pt-14 px-6 pb-6">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-xl font-bold">{client.firstName} {client.lastName}</h2>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium" style={{backgroundColor:`${statusColors[client.status]}15`,color:statusColors[client.status]}}><span className="w-1.5 h-1.5 rounded-full" style={{backgroundColor:statusColors[client.status]}}/>{client.status.charAt(0).toUpperCase()+client.status.slice(1)}</span>
              </div>
              <p className="text-muted-foreground text-sm">{client.position} en {client.company}</p>
            </div>
            <div className="flex items-center gap-2"><button className="flex items-center gap-2 px-3.5 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors"><Edit className="w-3.5 h-3.5"/>Editar</button><button className="flex items-center gap-2 px-3.5 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted text-destructive transition-colors"><Trash2 className="w-3.5 h-3.5"/>Eliminar</button></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {[
              {icon:Mail,label:'Email',value:client.email},
              {icon:Phone,label:'Teléfono',value:client.phone},
              {icon:MapPin,label:'Ubicación',value:`${client.city}, ${client.country}`},
              {icon:Calendar,label:'Creación',value:formatDate(client.createdAt)},
            ].map(item=>(<div key={item.label} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30"><item.icon className="w-4 h-4 text-muted-foreground flex-shrink-0"/><div className="min-w-0"><p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">{item.label}</p><p className="text-sm font-medium truncate mt-0.5">{item.value}</p></div></div>))}
          </div>
          {client.tags.length>0&&(<div className="flex items-center gap-2 mt-4 flex-wrap"><Tag className="w-3.5 h-3.5 text-muted-foreground"/>{client.tags.map(t=><span key={t} className="px-2.5 py-0.5 rounded-full bg-muted text-xs font-medium text-muted-foreground">{t}</span>)}</div>)}
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {label:'Valor Comercial',value:formatCurrency(client.value),color:'text-primary'},
          {label:'Oportunidades',value:clientOps.length.toString(),color:'text-foreground'},
          {label:'Pipeline Activo',value:formatCurrency(totalOpValue),color:'text-primary'},
          {label:'Tareas Activas',value:clientTasks.filter(t=>t.status!=='completada').length.toString(),color:'text-foreground'},
        ].map(k=>(<motion.div key={k.label} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="bg-card border border-border rounded-xl p-4"><p className="text-xs text-muted-foreground mb-1">{k.label}</p><p className={cn("text-xl font-bold",k.color)}>{k.value}</p></motion.div>))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border"><h3 className="text-sm font-semibold">Oportunidades ({clientOps.length})</h3></div>
          <div className="divide-y divide-border/50 max-h-[400px] overflow-y-auto">{clientOps.map(o=>(
            <div key={o.id} className="px-5 py-3.5 hover:bg-muted/30 transition-colors">
              <div className="flex items-center justify-between mb-1.5"><p className="text-sm font-medium">{o.title}</p><span className="text-sm font-semibold">{formatCurrency(o.value)}</span></div>
              <div className="flex items-center justify-between"><span className="inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full" style={{backgroundColor:`${stageColors[o.stage]}15`,color:stageColors[o.stage]}}><span className="w-1.5 h-1.5 rounded-full" style={{backgroundColor:stageColors[o.stage]}}/>{stageLabels[o.stage]}</span><span className="text-xs text-muted-foreground">Cierre: {formatDate(o.expectedCloseDate)}</span></span></div>
            </div>
          ))}{clientOps.length===0&&<div className="px-5 py-8 text-center text-sm text-muted-foreground">Sin oportunidades</div>}</div>
        </div>
        <div className="bg-card border border-border rounded-xl">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border"><h3 className="text-sm font-semibold">Timeline ({clientActivities.length})</h3></div>
          <div className="max-h-[400px] overflow-y-auto px-5 py-4">
            <div className="relative space-y-6 before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-px before:bg-border">
              {clientActivities.map(a=>(
                <div key={a.id} className="relative flex gap-4 pl-10">
                  <div className={cn("absolute left-0 top-0.5 w-[30px] h-[30px] rounded-full flex items-center justify-center text-xs",a.type==='llamada'?'bg-green-500/15 text-green-500':a.type==='email'?'bg-blue-500/15 text-blue-500':a.type==='reunion'?'bg-purple-500/15 text-purple-500':'bg-muted text-muted-foreground')}>{activityIcons[a.type]}</div>
                  <div className="flex-1 min-w-0 pb-1"><p className="text-sm font-medium">{a.title}</p><p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{a.description}</p><p className="text-[11px] text-muted-foreground/60 mt-1">{a.userName} · {timeAgo(a.createdAt)}</p></div>
                </div>
              ))}
            </div>
            {clientActivities.length===0&&<div className="py-8 text-center text-sm text-muted-foreground">Sin actividades</div>}
          </div>
        </div>
      </div>
    </div>
  );
}"""

print("Writing pages batch 2...")
for path, content in files.items():
    fp = os.path.join(B, path)
    os.makedirs(os.path.dirname(fp), exist_ok=True)
    with open(fp, 'w') as f:
        f.write(content)
    print(f"  OK {path}")
print("Batch 2 done")