import { TrendingUp, TrendingDown, Calendar, Clock, Target, Zap } from 'lucide-react';
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { StudySession } from '@/hooks/useSupabaseSync';

interface ProductivityMetricsProps {
  sessions: StudySession[];
  profile: any;
}

export const ProductivityMetrics = ({ sessions, profile }: ProductivityMetricsProps) => {
  const calculatePeriodStats = (startDate: Date, endDate: Date) => {
    const periodSessions = sessions.filter(session => {
      const sessionDate = new Date(session.started_at);
      return sessionDate >= startDate && sessionDate <= endDate;
    });

    return {
      totalMinutes: periodSessions.reduce((sum, s) => sum + s.duration_minutes, 0),
      totalSessions: periodSessions.length,
      avgSessionLength: periodSessions.length > 0 
        ? periodSessions.reduce((sum, s) => sum + s.duration_minutes, 0) / periodSessions.length 
        : 0
    };
  };

  // Estatísticas atuais vs períodos anteriores
  const now = new Date();
  
  // Semana atual vs anterior
  const thisWeekStart = startOfWeek(now, { weekStartsOn: 1 });
  const thisWeekEnd = endOfWeek(now, { weekStartsOn: 1 });
  const lastWeekStart = startOfWeek(subDays(now, 7), { weekStartsOn: 1 });
  const lastWeekEnd = endOfWeek(subDays(now, 7), { weekStartsOn: 1 });
  
  const thisWeek = calculatePeriodStats(thisWeekStart, thisWeekEnd);
  const lastWeek = calculatePeriodStats(lastWeekStart, lastWeekEnd);
  
  // Mês atual vs anterior
  const thisMonthStart = startOfMonth(now);
  const thisMonthEnd = endOfMonth(now);
  const lastMonthStart = startOfMonth(subDays(thisMonthStart, 1));
  const lastMonthEnd = endOfMonth(subDays(thisMonthStart, 1));
  
  const thisMonth = calculatePeriodStats(thisMonthStart, thisMonthEnd);
  const lastMonth = calculatePeriodStats(lastMonthStart, lastMonthEnd);

  // Calcular variações percentuais
  const weekHoursChange = lastWeek.totalMinutes > 0 
    ? ((thisWeek.totalMinutes - lastWeek.totalMinutes) / lastWeek.totalMinutes) * 100
    : thisWeek.totalMinutes > 0 ? 100 : 0;

  const monthHoursChange = lastMonth.totalMinutes > 0 
    ? ((thisMonth.totalMinutes - lastMonth.totalMinutes) / lastMonth.totalMinutes) * 100
    : thisMonth.totalMinutes > 0 ? 100 : 0;

  const weekSessionsChange = lastWeek.totalSessions > 0 
    ? ((thisWeek.totalSessions - lastWeek.totalSessions) / lastWeek.totalSessions) * 100
    : thisWeek.totalSessions > 0 ? 100 : 0;

  // Estatísticas hoje
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const todaySessions = sessions.filter(session => {
    const sessionDate = new Date(session.started_at);
    return sessionDate >= today && sessionDate < tomorrow;
  });

  const todayMinutes = todaySessions.reduce((sum, s) => sum + s.duration_minutes, 0);

  const renderTrend = (change: number) => {
    if (change > 0) {
      return (
        <div className="flex items-center text-green-400">
          <TrendingUp className="w-3 h-3 mr-1" />
          <span className="text-xs">+{change.toFixed(0)}%</span>
        </div>
      );
    } else if (change < 0) {
      return (
        <div className="flex items-center text-red-400">
          <TrendingDown className="w-3 h-3 mr-1" />
          <span className="text-xs">{change.toFixed(0)}%</span>
        </div>
      );
    } else {
      return <span className="text-xs text-muted-foreground">--</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Comparativos Semanais */}
      <div className="glass rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-primary" />
          Comparativo Semanal
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-muted/5 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-4 h-4 text-blue-400" />
              {renderTrend(weekHoursChange)}
            </div>
            <div className="text-2xl font-bold text-white">
              {(thisWeek.totalMinutes / 60).toFixed(1)}h
            </div>
            <div className="text-xs text-muted-foreground">
              Esta semana vs {(lastWeek.totalMinutes / 60).toFixed(1)}h anterior
            </div>
          </div>

          <div className="bg-muted/5 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-4 h-4 text-green-400" />
              {renderTrend(weekSessionsChange)}
            </div>
            <div className="text-2xl font-bold text-white">
              {thisWeek.totalSessions}
            </div>
            <div className="text-xs text-muted-foreground">
              Sessões vs {lastWeek.totalSessions} anterior
            </div>
          </div>

          <div className="bg-muted/5 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <Zap className="w-4 h-4 text-yellow-400" />
            </div>
            <div className="text-2xl font-bold text-white">
              {thisWeek.avgSessionLength.toFixed(0)}min
            </div>
            <div className="text-xs text-muted-foreground">
              Média por sessão
            </div>
          </div>
        </div>
      </div>

      {/* Comparativos Mensais */}
      <div className="glass rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-primary" />
          Comparativo Mensal
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">
                {format(thisMonthStart, 'MMMM yyyy', { locale: ptBR })}
              </span>
              {renderTrend(monthHoursChange)}
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {(thisMonth.totalMinutes / 60).toFixed(1)}h
            </div>
            <div className="text-sm text-muted-foreground">
              {thisMonth.totalSessions} sessões completadas
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">
                {format(lastMonthStart, 'MMMM yyyy', { locale: ptBR })}
              </span>
            </div>
            <div className="text-2xl font-medium text-muted-foreground mb-1">
              {(lastMonth.totalMinutes / 60).toFixed(1)}h
            </div>
            <div className="text-sm text-muted-foreground">
              {lastMonth.totalSessions} sessões completadas
            </div>
          </div>
        </div>
      </div>

      {/* Estatísticas Hoje */}
      <div className="glass rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Desempenho Hoje</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary mb-1">
              {(todayMinutes / 60).toFixed(1)}h
            </div>
            <div className="text-xs text-muted-foreground">Estudadas</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">
              {todaySessions.length}
            </div>
            <div className="text-xs text-muted-foreground">Sessões</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400 mb-1">
              {profile?.current_streak || 0}
            </div>
            <div className="text-xs text-muted-foreground">Sequência</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400 mb-1">
              {profile?.current_level || 1}
            </div>
            <div className="text-xs text-muted-foreground">Nível</div>
          </div>
        </div>
      </div>
    </div>
  );
};