import { useState, useMemo } from 'react';
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
}