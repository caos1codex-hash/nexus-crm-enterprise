import os
B = "/home/z/my-project/nexus-crm-enterprise/src"
files = {}

# PIPELINE PAGE (Kanban with DnD)
files["pages/PipelinePage.tsx"] = r"""import { useState, useMemo } from 'react';
import { useCRMStore } from '@/store/appStore';
import { cn, formatCurrency, stageColors, stageLabels } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors, closestCorners } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Plus, DollarSign, User, Calendar as CalIcon } from 'lucide-react';
import type { Opportunity, OpportunityStage } from '@/types';
import { useNavigate } from 'react-router-dom';

const stages: OpportunityStage[] = ['lead','contactado','calificado','reunion','propuesta','negociacion','ganado','perdido'];

function OpportunityCard({ opp, overlay=false }: {opp: Opportunity; overlay?:boolean }) {
  const navigate = useNavigate();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({id:opp.id, data:{opp}});
  const style = transform ? {transform:CSS.Transform.toString(transform),transition} : undefined;
  return (
    <motion.div ref={setNodeRef} style={style} layout={!overlay} initial={{opacity:0,y:8}} animate={{opacity:isDragging?0.5:1,y:0}} className={cn("bg-card border border-border rounded-xl p-4 cursor-pointer hover:shadow-md hover:border-primary/30 transition-all group",overlay&&"shadow-2xl rotate-2 scale-105 w-[300px]")} onClick={()=>navigate(`/clients/${opp.clientId}`)} {...(overlay?{}:{...attributes,...listeners})}>
      <div className="flex items-start justify-between mb-2"><p className="text-sm font-medium leading-snug flex-1 pr-2">{opp.title}</p><GripVertical className="w-4 h-4 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors flex-shrink-0 mt-0.5"/></div>
      <p className="text-xs text-muted-foreground mb-3">{opp.clientName}</p>
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-primary">{formatCurrency(opp.value)}</span>
        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{opp.probability}%</span>
      </div>
      <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border/50 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><User className="w-3 h-3"/>{opp.assignedName.split(' ')[0]}</span>
        <span className="flex items-center gap-1 ml-auto"><CalIcon className="w-3 h-3"/>{new Date(opp.expectedCloseDate).toLocaleDateString('es-ES',{month:'short',day:'numeric'})}</span>
      </div>
    </motion.div>
  );
}

export function PipelinePage() {
  const { opportunities, moveOpportunityStage } = useCRMStore();
  const [activeId, setActiveId] = useState<string|null>(null);
  const sensors = useSensors(useSensor(PointerSensor,{activationConstraint:{distance:8}}));
  const activeOpp = opportunities.find(o=>o.id===activeId);

  const grouped = useMemo(()=>{
    const g:Record<string,Opportunity[]> = {};
    stages.forEach(s=>g[s]=[]);
    opportunities.forEach(o=>{ if(g[o.stage]) g[o.stage].push(o); });
    return g;
  },[opportunities]);

  const handleDragStart = (e:DragStartEvent)=>setActiveId(e.active.id as string);
  const handleDragEnd = (e:DragEndEvent)=>{
    const {active,over} = e;
    if(over){
      const oppId = active.id as string;
      const overStage = stages.find(s=>over.id===s);
      if(overStage) moveOpportunityStage(oppId, overStage);
    }
    setActiveId(null);
  };

  return (
    <div className="p-6 lg:p-8 h-full flex flex-col animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div><h2 className="text-2xl font-bold tracking-tight">Pipeline de Ventas</h2><p className="text-muted-foreground text-sm mt-1">{opportunities.length} oportunidades en el pipeline</p></div>
      </div>
      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="flex gap-4 h-[calc(100vh-200px)] min-w-max">
            {stages.map(stage=>{
              const items = grouped[stage]||[];
              const total = items.reduce((s,o)=>s+o.value,0);
              return (
                <div key={stage} className="w-[310px] flex flex-col bg-muted/20 rounded-2xl border border-border/50 flex-shrink-0">
                  <div className="px-4 py-3 flex items-center justify-between flex-shrink-0">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{backgroundColor:stageColors[stage]}}/>
                      <span className="text-sm font-semibold">{stageLabels[stage]}</span>
                      <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">{items.length}</span>
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">{formatCurrency(total)}</span>
                  </div>
                  <SortableContext items={items.map(o=>o.id)} strategy={verticalListSortingStrategy}>
                    <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-2.5">
                      {items.map(opp=><OpportunityCard key={opp.id} opp={opp}/>)}
                      {items.length===0&&(<div className="h-24 rounded-xl border-2 border-dashed border-border/60 flex items-center justify-center text-xs text-muted-foreground">Arrastrar aquí</div>)}
                    </div>
                  </SortableContext>
                </div>
              );
            })}
          </div>
          <DragOverlay>
            {activeOpp&&<OpportunityCard opp={activeOpp} overlay={true}/>}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}"""

# TASKS PAGE
files["pages/TasksPage.tsx"] = r"""import { useState, useMemo } from 'react';
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
    addTask({id:generateId(),...form,assignedName:user?.name||'',createdAt:new Date().toISOString(),tags:form.tags?form.tags.split(',').map(t=>t.trim()):[]});
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
}"""

# CALENDAR PAGE
files["pages/CalendarPage.tsx"] = r"""import { useState, useMemo } from 'react';
import { useCRMStore } from '@/store/appStore';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Clock, Video, PhoneCall, Target } from 'lucide-react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';

const typeIcons:Record<string,React.ReactNode> = {reunion:<Video className="w-3 h-3"/>,llamada:<PhoneCall className="w-3 h-3"/>,seguimiento:<Target className="w-3 h-3"/>,evento:<Clock className="w-3 h-3"/>};

export function CalendarPage() {
  const { calendarEvents } = useCRMStore();
  const [currentDate, setCurrentDate] = useState(new Date(2026, 5, 1));
  const [selectedDate, setSelectedDate] = useState<string|null>(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calStart = startOfWeek(monthStart, {weekStartsOn:1});
  const calEnd = endOfWeek(monthEnd, {weekStartsOn:1});

  const days = useMemo(()=>{
    const d:Date[] = [];
    let day = calStart;
    while(day<=calEnd){ d.push(day); day = addDays(day,1); }
    return d;
  },[calStart.getTime(),calEnd.getTime()]);

  const eventsForDate = (dateStr:string) => calendarEvents.filter(e=>e.date===dateStr);
  const selectedEvents = selectedDate ? eventsForDate(selectedDate) : [];

  const weekDays = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div><h2 className="text-2xl font-bold tracking-tight">Calendario Comercial</h2><p className="text-muted-foreground text-sm mt-1">{calendarEvents.length} eventos programados</p></div>
      </div>
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h3 className="text-lg font-semibold">{format(currentDate,'MMMM yyyy',{locale:es})}</h3>
          <div className="flex items-center gap-2">
            <button onClick={()=>setCurrentDate(subMonths(currentDate,1))} className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors"><ChevronLeft className="w-4 h-4"/></button>
            <button onClick={()=>setCurrentDate(new Date())} className="px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-muted transition-colors">Hoy</button>
            <button onClick={()=>setCurrentDate(addMonths(currentDate,1))} className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors"><ChevronRight className="w-4 h-4"/></button>
          </div>
        </div>
        <div className="grid grid-cols-7 border-b border-border">
          {weekDays.map(d=>(<div key={d} className="py-2.5 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">{d}</div>))}
        </div>
        <div className="grid grid-cols-7">
          {days.map((day,i)=>{
            const dateStr = format(day,'yyyy-MM-dd');
            const events = eventsForDate(dateStr);
            const inMonth = isSameMonth(day, currentDate);
            const isToday = isSameDay(day, new Date());
            const isSelected = selectedDate === dateStr;
            return (
              <button key={i} onClick={()=>setSelectedDate(dateStr)} className={cn("min-h-[110px] p-1.5 border-b border-r border-border/50 text-left transition-colors hover:bg-muted/30",!inMonth&&"bg-muted/10",isSelected&&"bg-primary/5 ring-1 ring-primary/20 ring-inset")}>
                <span className={cn("inline-flex items-center justify-center w-7 h-7 rounded-full text-sm",isToday&&"bg-primary text-primary-foreground font-bold",!inMonth&&"text-muted-foreground/40")}>{format(day,'d')}</span>
                <div className="mt-1 space-y-0.5">
                  {events.slice(0,3).map(ev=>(
                    <div key={ev.id} className="text-[10px] leading-tight px-1.5 py-0.5 rounded truncate font-medium" style={{backgroundColor:`${ev.color}18`,color:ev.color}}>{ev.title}</div>
                  ))}
                  {events.length>3&&<div className="text-[10px] text-muted-foreground px-1.5">+{events.length-3} más</div>}
                </div>
              </button>
            );
          })}
        </div>
      </div>
      {selectedDate&&selectedEvents.length>0&&(
        <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} className="mt-6 bg-card border border-border rounded-xl p-5">
          <h4 className="text-sm font-semibold mb-3">{format(new Date(selectedDate),'EEEE d \'de\' MMMM',{locale:es})}</h4>
          <div className="space-y-2">
            {selectedEvents.map(ev=>(
              <div key={ev.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="w-1 h-10 rounded-full" style={{backgroundColor:ev.color}}/>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{ev.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{ev.assignedName} {ev.clientName&&`· ${ev.clientName}`}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-medium">{ev.startTime} - {ev.endTime}</p>
                  <p className="text-xs text-muted-foreground capitalize flex items-center gap-1 justify-end">{typeIcons[ev.type]}{ev.type}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}"""

# REPORTS PAGE
files["pages/ReportsPage.tsx"] = r"""import { useAppStore, useCRMStore } from '@/store/appStore';
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
          <ResponsiveContainer width="100%" height={280}><AreaChart data={monthlySalesData}><defs><linearGradient id="rs1" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.2}/><stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke={gc}/><XAxis dataKey="name" tick={{fontSize:12,fill:tc}} axisLine={false} tickLine={false}/><YAxis tick={{fontSize:12,fill:tc}} axisLine={false} tickLine={false} tickFormatter={v=>`$${v/1000}K`}/><Tooltip contentStyle={{backgroundColor:tb,border:`1px solid ${tbo}`,borderRadius:8,fontSize:13}} formatter={(v:number)=>formatCurrency(v)}/><Area type="monotone" dataKey="value" stroke="var(--color-primary)" strokeWidth={2} fill="url(#rs1)"/></AreaChart></ResponsiveContainer>
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
          <ResponsiveContainer width="100%" height={280}><PieChart><Pie data={sourceData} cx="50%" cy="50%" outerRadius={100} innerRadius={60} paddingAngle={3} dataKey="value" nameKey="name" label={({name,percent})=>`${name} ${(percent*100).toFixed(0)}%`} labelLine={false}>{sourceData.map((entry,i)=><Cell key={i} fill={entry.color}/>)}</Pie><Tooltip contentStyle={{backgroundColor:tb,border:`1px solid ${tbo}`,borderRadius:8,fontSize:13}}/></PieChart></ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}"""

# NOTES PAGE
files["pages/NotesPage.tsx"] = r"""import { useState } from 'react';
import { useCRMStore } from '@/store/appStore';
import { cn, timeAgo, getInitials } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Search, Pin, Tag, FileText } from 'lucide-react';
import { generateId } from '@/lib/utils';

export function NotesPage() {
  const { notes, addNote, deleteNote, updateNote } = useCRMStore();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedNote, setSelectedNote] = useState<string|null>(null);
  const [form, setForm] = useState({title:'',content:'',clientId:'',tags:''});

  const filtered = search ? notes.filter(n=>`${n.title} ${n.content} ${n.clientName||''}`.toLowerCase().includes(search.toLowerCase())) : notes;
  const pinned = filtered.filter(n=>n.isPinned);
  const unpinned = filtered.filter(n=>!n.isPinned);
  const activeNote = notes.find(n=>n.id===selectedNote);

  const handleAdd = ()=>{
    addNote({id:generateId(),...form,clientId:form.clientId||undefined,clientName:form.clientId?notes.find(n=>n.clientId===form.clientId)?.clientName:undefined,createdBy:'u1',createdByName:'Alejandro Ruiz',createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),tags:form.tags?form.tags.split(',').map(t=>t.trim()):[],isPinned:false});
    setShowModal(false);
    setForm({title:'',content:'',clientId:'',tags:''});
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div><h2 className="text-2xl font-bold tracking-tight">Notas</h2><p className="text-muted-foreground text-sm mt-1">{notes.length} notas creadas</p></div>
        <button onClick={()=>setShowModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"><Plus className="w-4 h-4"/>Nueva Nota</button>
      </div>
      <div className="relative mb-5"><Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar notas..." className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"/></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto">
          {pinned.length>0&&<p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">Fijadas</p>}
          {pinned.map(n=>(<button key={n.id} onClick={()=>setSelectedNote(n.id)} className={cn("w-full text-left bg-card border border-border rounded-xl p-4 hover:shadow-sm transition-all",selectedNote===n.id&&"ring-1 ring-primary/40 bg-primary/5")}>
            <div className="flex items-start justify-between mb-1"><p className="text-sm font-medium flex-1">{n.title}</p>{n.isPinned&&<Pin className="w-3.5 h-3.5 text-primary flex-shrink-0"/>}</div>
            <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{n.content}</p>
            <div className="flex items-center justify-between"><span className="text-[11px] text-muted-foreground">{timeAgo(n.updatedAt)}</span>{n.clientName&&<span className="text-[11px] text-primary">{n.clientName}</span>}</div>
          </button>))}
          {unpinned.length>0&&<p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1 pt-2">{pinned.length>0?'Otras':'Todas'}</p>}
          {unpinned.map(n=>(<button key={n.id} onClick={()=>setSelectedNote(n.id)} className={cn("w-full text-left bg-card border border-border rounded-xl p-4 hover:shadow-sm transition-all",selectedNote===n.id&&"ring-1 ring-primary/40 bg-primary/5")}>
            <div className="flex items-start justify-between mb-1"><p className="text-sm font-medium flex-1">{n.title}</p></div>
            <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{n.content}</p>
            <div className="flex items-center justify-between"><span className="text-[11px] text-muted-foreground">{timeAgo(n.updatedAt)}</span>{n.clientName&&<span className="text-[11px] text-primary">{n.clientName}</span>}</div>
          </button>))}
        </div>
        <div className="lg:col-span-2">
          {activeNote?(
            <motion.div key={activeNote.id} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-start justify-between mb-4"><div><h3 className="text-lg font-bold">{activeNote.title}</h3><div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground"><span>{activeNote.createdByName}</span><span>·</span><span>{timeAgo(activeNote.createdAt)}</span>{activeNote.clientName&&<><span>·</span><span className="text-primary">{activeNote.clientName}</span></>}</div></div><button onClick={()=>deleteNote(activeNote.id);setSelectedNote(null)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive"><X className="w-4 h-4"/></button></div>
              <div className="prose prose-sm dark:prose-invert max-w-none text-sm leading-relaxed whitespace-pre-wrap">{activeNote.content}</div>
              {activeNote.tags.length>0&&(<div className="flex items-center gap-2 mt-6 pt-4 border-t border-border"><Tag className="w-3.5 h-3.5 text-muted-foreground"/>{activeNote.tags.map(t=><span key={t} className="px-2.5 py-0.5 rounded-full bg-muted text-xs font-medium text-muted-foreground">{t}</span>)}</div>)}
            </motion.div>
          ):(
            <div className="bg-card border border-border rounded-xl h-full min-h-[400px] flex flex-col items-center justify-center text-muted-foreground"><FileText className="w-12 h-12 mb-3 text-muted-foreground/30"/><p className="text-sm">Selecciona una nota para ver su contenido</p></div>
          )}
        </div>
      </div>
      <AnimatePresence>{showModal&&(<motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={()=>setShowModal(false)}><motion.div initial={{opacity:0,y:20,scale:0.96}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:20,scale:0.96}} className="w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl" onClick={e=>e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-border"><h3 className="text-lg font-semibold">Nueva Nota</h3><button onClick={()=>setShowModal(false)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground"><X className="w-4 h-4"/></button></div>
        <div className="px-6 py-5 space-y-4"><div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">Título</label><input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"/></div><div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">Contenido</label><textarea value={form.content} onChange={e=>setForm({...form,content:e.target.value})} rows={6} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"/></div><div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">Etiquetas (separadas por coma)</label><input value={form.tags} onChange={e=>setForm({...form,tags:e.target.value})} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"/></div></div>
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border"><button onClick={()=>setShowModal(false)} className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted">Cancelar</button><button onClick={handleAdd} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90">Crear Nota</button></div>
      </motion.div></motion.div>)}</AnimatePresence>
    </div>
  );
}"""

# AUTOMATIONS PAGE
files["pages/AutomationsPage.tsx"] = r"""import { useCRMStore } from '@/store/appStore';
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
}"""

# AI PAGE
files["pages/AIPage.tsx"] = r"""import { useCRMStore } from '@/store/appStore';
import { cn, timeAgo } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Brain, TrendingUp, Lightbulb, AlertTriangle, FileText, Sparkles, BarChart3, Target, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const typeConfig:Record<string,{icon:React.ComponentType<{className?:string}>;color:string;bg:string;label:string}> = {
  prediction:{icon:TrendingUp,color:'text-blue-500',bg:'bg-blue-500/10',label:'Predicción'},
  suggestion:{icon:Lightbulb,color:'text-amber-500',bg:'bg-amber-500/10',label:'Sugerencia'},
  summary:{icon:FileText,color:'text-purple-500',bg:'bg-purple-500/10',label:'Resumen'},
  alert:{icon:AlertTriangle,color:'text-red-500',bg:'bg-red-500/10',label:'Alerta'},
};

export function AIPage() {
  const { aiInsights } = useCRMStore();
  const navigate = useNavigate();

  return (
    <div className="p-6 lg:p-8 max-w-[1200px] mx-auto animate-fade-in space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center"><Brain className="w-5 h-5 text-primary"/></div>
        <div><h2 className="text-2xl font-bold tracking-tight">IA Empresarial</h2><p className="text-muted-foreground text-sm mt-0.5">Insights y recomendaciones inteligentes para tu equipo</p></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-5"><div className="flex items-center gap-3 mb-2"><Sparkles className="w-5 h-5 text-primary"/><span className="text-sm font-semibold">Predicción de Ventas Q3</span></div><p className="text-2xl font-bold">$2.1M</p><p className="text-xs text-muted-foreground mt-1">Proyección basada en pipeline actual y velocidad de cierre</p><div className="mt-3 flex items-center gap-2"><div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden"><div className="h-full w-[78%] rounded-full bg-primary"/></div><span className="text-xs font-medium text-primary">78%</span></div></div>
        <div className="bg-card border border-border rounded-xl p-5"><div className="flex items-center gap-3 mb-2"><Target className="w-5 h-5 text-green-500"/><span className="text-sm font-semibold">Tasa de Cierre Esperada</span></div><p className="text-2xl font-bold">34.2%</p><p className="text-xs text-muted-foreground mt-1">5.1 puntos porcentuales superior al mes anterior</p></div>
        <div className="bg-card border border-border rounded-xl p-5"><div className="flex items-center gap-3 mb-2"><BarChart3 className="w-5 h-5 text-amber-500"/><span className="text-sm font-semibold">Oportunidades en Riesgo</span></div><p className="2xl font-bold text-red-500">3</p><p className="text-xs text-muted-foreground mt-1">Requieren atención inmediata para evitar pérdida</p></div>
      </div>
      <div>
        <h3 className="text-base font-semibold mb-4">Insights Recientes</h3>
        <div className="space-y-3">
          {aiInsights.map((insight,i)=>{
            const cfg = typeConfig[insight.type];
            const Icon = cfg.icon;
            return (
              <motion.div key={insight.id} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*0.05}} className="bg-card border border-border rounded-xl p-5 hover:shadow-sm transition-shadow group">
                <div className="flex items-start gap-4">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",cfg.bg)}><Icon className={cn("w-5 h-5",cfg.color)}/></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn("text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full",cfg.bg,cfg.color)}>{cfg.label}</span>
                      <span className="text-xs text-muted-foreground">{timeAgo(insight.createdAt)}</span>
                      <span className="ml-auto text-xs font-medium text-muted-foreground">{insight.confidence}% confianza</span>
                    </div>
                    <h4 className="text-sm font-semibold mb-1">{insight.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{insight.description}</p>
                    {insight.clientName&&(<button onClick={()=>navigate(`/clients/${insight.clientId}`)} className="flex items-center gap-1 text-xs text-primary font-medium mt-2 hover:underline"><ArrowRight className="w-3 h-3"/>Ver {insight.clientName}</button>)}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}"""

# SETTINGS PAGE
files["pages/SettingsPage.tsx"] = r"""import { useAppStore, useCRMStore } from '@/store/appStore';
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
}"""

print("Writing all remaining pages...")
for path, content in files.items():
    fp = os.path.join(B, path)
    os.makedirs(os.path.dirname(fp), exist_ok=True)
    with open(fp, 'w') as f:
        f.write(content)
    print(f"  OK {path}")
print("All pages done!")