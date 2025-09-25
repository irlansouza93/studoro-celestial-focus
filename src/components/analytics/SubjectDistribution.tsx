import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import type { Subject } from '@/hooks/useSupabaseSync';

interface SubjectDistributionProps {
  subjects: Subject[];
}

export const SubjectDistribution = ({ subjects }: SubjectDistributionProps) => {
  const COLORS = [
    'hsl(var(--primary))',
    'hsl(var(--secondary))',
    'hsl(var(--accent))',
    '#8884d8',
    '#82ca9d',
    '#ffc658',
    '#ff7c7c',
    '#8dd1e1',
    '#d084d0',
    '#ffb347'
  ];

  const chartData = subjects
    .filter(subject => subject.total_study_time > 0)
    .map((subject, index) => ({
      name: subject.name,
      value: subject.total_study_time,
      hours: (subject.total_study_time / 60).toFixed(1),
      sessions: subject.total_sessions,
      color: COLORS[index % COLORS.length],
      icon: subject.icon
    }))
    .sort((a, b) => b.value - a.value);

  if (chartData.length === 0) {
    return (
      <div className="glass rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Distribuição por Matéria</h3>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Nenhum dado de estudo disponível ainda</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Distribuição por Matéria</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [`${(value / 60).toFixed(1)}h`, 'Tempo estudado']}
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--popover-foreground))'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legenda personalizada */}
        <div className="space-y-3">
          {chartData.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm">{item.icon}</span>
                <span className="text-sm text-white">{item.name}</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-white">{item.hours}h</div>
                <div className="text-xs text-muted-foreground">{item.sessions} sessões</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};