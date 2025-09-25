import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subDays, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TimelineChartProps {
  sessions: Array<{
    started_at: string;
    duration_minutes: number;
  }>;
  period: 'week' | 'month' | '3months';
}

export const TimelineChart = ({ sessions, period }: TimelineChartProps) => {
  const generateTimelineData = () => {
    const days = period === 'week' ? 7 : period === 'month' ? 30 : 90;
    const data = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = startOfDay(subDays(new Date(), i));
      const dayStart = date.toISOString();
      const dayEnd = new Date(date.getTime() + 24 * 60 * 60 * 1000).toISOString();

      const dailySessions = sessions.filter(
        session => session.started_at >= dayStart && session.started_at < dayEnd
      );

      const totalMinutes = dailySessions.reduce(
        (sum, session) => sum + session.duration_minutes, 0
      );

      const hours = totalMinutes / 60;

      data.push({
        date: format(date, period === 'week' ? 'EEE' : 'dd/MM', { locale: ptBR }),
        fullDate: format(date, 'dd/MM/yyyy', { locale: ptBR }),
        hours: Number(hours.toFixed(1)),
        sessions: dailySessions.length
      });
    }

    return data;
  };

  const timelineData = generateTimelineData();

  return (
    <div className="glass rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-4">
        Evolução de Estudos - {period === 'week' ? 'Última Semana' : period === 'month' ? 'Último Mês' : 'Últimos 3 Meses'}
      </h3>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={timelineData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="date" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              label={{ value: 'Horas', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--popover-foreground))'
              }}
              formatter={(value: number, name: string) => [
                name === 'hours' ? `${value}h` : value,
                name === 'hours' ? 'Horas estudadas' : 'Sessões'
              ]}
              labelFormatter={(label) => timelineData.find(d => d.date === label)?.fullDate || label}
            />
            <Line
              type="monotone"
              dataKey="hours"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};