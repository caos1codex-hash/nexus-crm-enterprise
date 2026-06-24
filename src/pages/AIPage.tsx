import { useCRMStore } from '@/store/appStore';
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
}