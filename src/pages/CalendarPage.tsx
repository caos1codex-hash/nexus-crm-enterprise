import { useState, useMemo } from 'react';
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
}