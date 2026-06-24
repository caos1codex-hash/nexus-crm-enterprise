import { useState, useMemo } from 'react';
import { useCRMStore } from '@/store/appStore';
import { cn, formatDate, priorityColors } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Filter, X, Calendar, User, Flag, CheckCircle2, Circle, Clock, List, LayoutGrid, AlertCircle, Minus } from 'lucide-react';
import { generateId } from '@/lib/utils';
import type { Priority, TaskStatus } from '@/types';

const statusIcons:Record<string,React.ReactNode> = {pendiente:<Circle className="w-4 h-4 text-muted-foreground"/>,en_progreso:<Clock className="w-4 h-4 text-amber-500"/>,completada:<CheckCircle2 className="w-4 h-4 text-green-500"/>,cancelada:<Minus className="w-4 h-4 text-muted-foreground/40"/>};
const priorityLabels:Record<string,string> = {urgente:'Urgente',alta:'Alta',media:'Media',baja:'Baja'};
const statusLabels:Record<string,string> = {pendiente:'Pendiente',en_progreso:'En Progreso',completada:'Completada',cancelada:'Cancelada'};

export function TasksPage() {
  const { tasks, addTask, updateTask, deleteTask, users } = useCRMStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [view, setView] = useState<'list'|'kanban'>('list');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({title:'',description:'',assignedTo:'u1',priority:'media' as Priority,dueDate:'',clientId:'',tags:''});

  const filtered = useMemo(()=>{
    let list = [...tasks];
    if(search) list = list.filter(t=>t.title.toLowerCase().includes(search.toLowerCase()));
    if(statusFilter!=='all') list = list.filter(t=>t.status===statusFilter);
    if(priorityFilter!=='all') list = list.filter(t=>t.priority===priorityFilter);
    return list.sort((a,b)=>new Date(b.createdAt).getTime()-new Date(a.createdAt).getTime());
  },[tasks,search,statusFilter,priorityFilter]);

  const kanbanGroups = useMemo(()=>{
    const g:Record<string,typeof tasks> = {pendiente:[],en_progreso:[],completada:[]};
    filtered.forEach(t=>{ if(g[t.status]) g[t.status].push(t); });
    return g;
  },[filtered]);

  const handleAdd = ()=>{
    const user = users.find(u=>u.id===form.assignedTo);
    addTask({id:generateId(),...form,status:'pendiente' as const,assignedName:user?.name||'',createdAt:new Date().toISOString(),tags:form.tags?form.tags.split(',').map(t=>t.trim()):[]});
    setShowModal(false);
    setForm({title:'',description:'',assignedTo:'u1',priority:'media',dueDate:'',clientId:'',tags:''});
  };

  const toggleStatus = (id:string)=>{
    const t = tasks.find(tk=>tk.id===id);
    if(!t) return;
    const next:Record<string,TaskStatus> = {pendiente:'en_progreso',en_progreso:'completada',completada:'pendiente',cancelada:'pendiente'};
    updateTask(id, {status: next[t.status]||'pendiente'});
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div><h2 className="text-2xl font-bold tracking-tight">Tareas</h2><p className="text-muted-foreground text-sm mt-1">{tasks.length} tareas · {tasks.filter(t=>t.status==='pendiente').length} pendientes · {tasks.filter(t=>t.status==='completada').length} completadas</p></div>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-muted rounded-lg p-0.5 border border-border"><button onClick={()=>setView('list')} className={cn("p-1.5 rounded-md transition-colors",view==='list'?"bg-card shadow-sm text-foreground":"text-muted-foreground")}><List className="w-4 h-4"/></button><button onClick={()=>setView('kanban')} className={cn("p-1.5 rounded-md transition-colors",view==='kanban'?"bg-card shadow-sm text-foreground":"text-muted-foreground")}><LayoutGrid className="w-4 h-4"/></button></div>
          <button onClick={()=>setShowModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"><Plus className="w-4 h-4"/>Nueva Tarea</button>
        </div>
      </div>
      <div className="flex items-center gap-3 mb-5">
        <div className="relative flex-1"><Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar tareas..." className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"/></div>
        <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} className="px-3 py-2.5 rounded-lg border border-border bg-card text-sm"><option value="all">Todos los estados</option>{Object.entries(statusLabels).map(([k,v])=><option key={k} value={k}>{v}</option>)}</select>
        <select value={priorityFilter} onChange={e=>setPriorityFilter(e.target.value)} className="px-3 py-2.5 rounded-lg border border-border bg-card text-sm"><option value="all">Todas las prioridades</option>{Object.entries(priorityLabels).map(([k,v])=><option key={k} value={k}>{v}</option>)}</select>
      </div>

      {view==='list'?(
        <div className="space-y-2">
          {filtered.map((t,i)=>(
            <motion.div key={t.id} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:i*0.02}} className="bg-card border border-border rounded-xl p-4 flex items-center gap-4 hover:shadow-sm transition-shadow group">
              <button onClick={()=>toggleStatus(t.id)} className="flex-shrink-0 mt-0.5 transition-transform hover:scale-110">{statusIcons[t.status]}</button>
              <div className="flex-1 min-w-0">
                <p className={cn("text-sm font-medium",t.status==='completada'&&"line-through text-muted-foreground")}>{t.title}</p>
                {t.clientName&&<p className="text-xs text-muted-foreground mt-0.5">{t.clientName}</p>}
              </div>
              <span className={cn("inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full",t.priority==='urgente'?"bg-red-500/15 text-red-500":t.priority==='alta'?"bg-orange-500/15 text-orange-500":t.priority==='media'?"bg-amber-500/15 text-amber-500":"bg-slate-500/15 text-slate-500")}><Flag className="w-3 h-3"/>{priorityLabels[t.priority]}</span>
              <span className="text-xs text-muted-foreground hidden md:flex items-center gap-1"><User className="w-3 h-3"/>{t.assignedName.split(' ')[0]}</span>
              {t.dueDate&&<span className="text-xs text-muted-foreground hidden lg:flex items-center gap-1"><Calendar className="w-3 h-3"/>{formatDate(t.dueDate)}</span>}
              <button onClick={()=>deleteTask(t.id)} className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all"><X className="w-3.5 h-3.5"/></button>
            </motion.div>
          ))}
          {filtered.length===0&&<div className="py-16 text-center text-sm text-muted-foreground">No se encontraron tareas</div>}
        </div>
      ):(
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(['pendiente','en_progreso','completada'] as const).map(status=>(
            <div key={status} className="space-y-3">
              <div className="flex items-center gap-2 mb-2"><span className="text-sm font-semibold">{statusLabels[status]}</span><span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">{kanbanGroups[status].length}</span></div>
              <div className="space-y-2">{kanbanGroups[status].map(t=>(
                <div key={t.id} className="bg-card border border-border rounded-xl p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-center gap-2 mb-2">{statusIcons[t.status]}<span className={cn("text-sm font-medium",t.status==='completada'&&"line-through text-muted-foreground")}>{t.title}</span></div>
                  <div className="flex items-center justify-between mt-2"><span className={cn("text-xs font-medium px-2 py-0.5 rounded-full",t.priority==='urgente'?"bg-red-500/15 text-red-500":t.priority==='alta'?"bg-orange-500/15 text-orange-500":"bg-amber-500/15 text-amber-500")}>{priorityLabels[t.priority]}</span><span className="text-xs text-muted-foreground">{t.assignedName.split(' ')[0]}</span></div>
                </div>
              ))}</div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>{showModal&&(<motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={()=>setShowModal(false)}><motion.div initial={{opacity:0,y:20,scale:0.96}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:20,scale:0.96}} className="w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl" onClick={e=>e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-border"><h3 className="text-lg font-semibold">Nueva Tarea</h3><button onClick={()=>setShowModal(false)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground"><X className="w-4 h-4"/></button></div>
        <div className="px-6 py-5 space-y-4">
          <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">Título</label><input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"/></div>
          <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">Descripción</label><textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} rows={3} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"/></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">Asignar a</label><select value={form.assignedTo} onChange={e=>setForm({...form,assignedTo:e.target.value})} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm">{users.map(u=><option key={u.id} value={u.id}>{u.name}</option>)}</select></div>
            <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">Prioridad</label><select value={form.priority} onChange={e=>setForm({...form,priority:e.target.value as Priority})} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm">{Object.entries(priorityLabels).map(([k,v])=><option key={k} value={k}>{v}</option>)}</select></div>
          </div>
          <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">Fecha límite</label><input type="date" value={form.dueDate} onChange={e=>setForm({...form,dueDate:e.target.value})} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"/></div>
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border"><button onClick={()=>setShowModal(false)} className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted">Cancelar</button><button onClick={handleAdd} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90">Crear Tarea</button></div>
      </motion.div></motion.div>)}</AnimatePresence>
    </div>
  );
}