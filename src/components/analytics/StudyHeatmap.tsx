import { format, startOfWeek, addDays, subWeeks, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface StudyHeatmapProps {
  sessions: Array<{
    started_at: string;
    duration_minutes: number;
  }>;
}

export const StudyHeatmap = ({ sessions }: StudyHeatmapProps) => {
  const generateHeatmapData = () => {
    const weeks = 12; // 3 meses
    const data = [];

    for (let weekIndex = 0; weekIndex < weeks; weekIndex++) {
      const weekStart = startOfWeek(subWeeks(new Date(), weeks - 1 - weekIndex), { weekStartsOn: 0 });
      const weekData = [];

      for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
        const currentDay = addDays(weekStart, dayIndex);
        const dayStart = currentDay.toISOString();
        const dayEnd = new Date(currentDay.getTime() + 24 * 60 * 60 * 1000).toISOString();

        const daySessions = sessions.filter(
          session => session.started_at >= dayStart && session.started_at < dayEnd
        );

        const totalMinutes = daySessions.reduce(
          (sum, session) => sum + session.duration_minutes, 0
        );

        weekData.push({
          date: currentDay,
          minutes: totalMinutes,
          hours: totalMinutes / 60,
          sessions: daySessions.length,
          intensity: Math.min(Math.floor(totalMinutes / 30), 4) // 0-4 levels
        });
      }

      data.push(weekData);
    }

    return data;
  };

  const heatmapData = generateHeatmapData();
  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const getIntensityColor = (intensity: number) => {
    const colors = [
      'bg-muted/20', // 0 - sem estudo
      'bg-primary/20', // 1 - baixo
      'bg-primary/40', // 2 - médio
      'bg-primary/60', // 3 - alto
      'bg-primary/80', // 4 - muito alto
    ];
    return colors[intensity] || colors[0];
  };

  return (
    <div className="glass rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Consistência de Estudos</h3>
      
      <div className="space-y-4">
        {/* Cabeçalho dos dias da semana */}
        <div className="grid grid-cols-7 gap-1 text-xs text-muted-foreground">
          {dayNames.map(day => (
            <div key={day} className="text-center py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Heatmap */}
        <TooltipProvider>
          <div className="space-y-1">
            {heatmapData.map((week, weekIndex) => (
              <div key={weekIndex} className="grid grid-cols-7 gap-1">
                {week.map((day, dayIndex) => (
                  <Tooltip key={dayIndex}>
                    <TooltipTrigger asChild>
                      <div
                        className={`
                          w-3 h-3 rounded-sm cursor-pointer transition-all duration-200 hover:scale-125
                          ${getIntensityColor(day.intensity)}
                          border border-border/20
                        `}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="text-sm">
                        <div className="font-medium">
                          {format(day.date, 'dd MMM yyyy', { locale: ptBR })}
                        </div>
                        <div className="text-muted-foreground">
                          {day.hours > 0 ? `${day.hours.toFixed(1)}h estudadas` : 'Sem estudos'}
                        </div>
                        {day.sessions > 0 && (
                          <div className="text-muted-foreground">
                            {day.sessions} sessões
                          </div>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            ))}
          </div>
        </TooltipProvider>

        {/* Legenda */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Menos</span>
          <div className="flex space-x-1">
            {[0, 1, 2, 3, 4].map(level => (
              <div
                key={level}
                className={`w-3 h-3 rounded-sm ${getIntensityColor(level)} border border-border/20`}
              />
            ))}
          </div>
          <span>Mais</span>
        </div>
      </div>
    </div>
  );
};