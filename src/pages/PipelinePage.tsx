import { useState, useMemo } from 'react';
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
}