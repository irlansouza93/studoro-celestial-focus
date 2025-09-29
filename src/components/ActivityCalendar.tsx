import { useMemo } from 'react';
import { useSupabaseSync } from '@/hooks/useSupabaseSync';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, startOfWeek, endOfWeek } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const ActivityCalendar = () => {
  const { recentSessions: sessions } = useSupabaseSync();

  const currentMonth = useMemo(() => {
    const today = new Date();
    const start = startOfWeek(startOfMonth(today), { locale: ptBR });
    const end = endOfWeek(endOfMonth(today), { locale: ptBR });
    return eachDayOfInterval({ start, end });
  }, []);

  const getActivityForDay = (day: Date) => {
    const daySessions = sessions.filter(s => 
      isSameDay(new Date(s.started_at), day)
    );
    const totalMinutes = daySessions.reduce((acc, s) => acc + s.duration_minutes, 0);
    return { count: daySessions.length, minutes: totalMinutes };
  };

  const getIntensityClass = (minutes: number) => {
    if (minutes === 0) return 'bg-muted/30';
    if (minutes < 30) return 'bg-primary/30';
    if (minutes < 60) return 'bg-primary/50';
    if (minutes < 120) return 'bg-primary/70';
    return 'bg-primary';
  };

  const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

  return (
    <div className="glass rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">
        Calendário de Atividades • {format(new Date(), 'MMMM yyyy', { locale: ptBR })}
      </h3>
      
      <div className="space-y-2">
        {/* Week days header */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {weekDays.map((day, i) => (
            <div key={i} className="text-center text-xs text-muted-foreground font-medium">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-2">
          {currentMonth.map((day, i) => {
            const activity = getActivityForDay(day);
            const isToday = isSameDay(day, new Date());
            const isCurrentMonth = day.getMonth() === new Date().getMonth();

            return (
              <div
                key={i}
                className={`
                  aspect-square rounded-lg transition-all duration-300 cursor-pointer
                  ${getIntensityClass(activity.minutes)}
                  ${isToday ? 'ring-2 ring-accent ring-offset-2 ring-offset-background' : ''}
                  ${!isCurrentMonth ? 'opacity-30' : ''}
                  hover:scale-110 hover:shadow-lg group relative
                `}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-xs font-medium ${
                    activity.minutes > 0 ? 'text-white' : 'text-muted-foreground'
                  }`}>
                    {format(day, 'd')}
                  </span>
                </div>
                
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  <div className="glass rounded-lg px-3 py-2 text-xs whitespace-nowrap">
                    <div className="text-white font-medium">
                      {format(day, "d 'de' MMM", { locale: ptBR })}
                    </div>
                    {activity.count > 0 ? (
                      <>
                        <div className="text-muted-foreground">
                          {activity.count} sessõe{activity.count > 1 ? 's' : ''}
                        </div>
                        <div className="text-accent">
                          {activity.minutes} min
                        </div>
                      </>
                    ) : (
                      <div className="text-muted-foreground">Sem atividade</div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-end space-x-2 mt-4 text-xs text-muted-foreground">
          <span>Menos</span>
          <div className="flex space-x-1">
            <div className="w-4 h-4 rounded bg-muted/30" />
            <div className="w-4 h-4 rounded bg-primary/30" />
            <div className="w-4 h-4 rounded bg-primary/50" />
            <div className="w-4 h-4 rounded bg-primary/70" />
            <div className="w-4 h-4 rounded bg-primary" />
          </div>
          <span>Mais</span>
        </div>
      </div>
    </div>
  );
};
