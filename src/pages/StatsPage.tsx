import { BarChart3, Clock, Zap, Target, TrendingUp, Calendar } from 'lucide-react';
import { useStudoroStore } from '@/hooks/useStudoroStore';
import { useSupabaseSync } from '@/hooks/useSupabaseSync';

export const StatsPage = () => {
  const {
    level,
    xp,
    xpToNextLevel,
    completedToday,  
    currentStreak,
    longestStreak,
    totalSessions,
  } = useStudoroStore();
  
  const { subjects, profile } = useSupabaseSync();

  const totalTimeSpent = subjects.reduce((total, subject) => total + subject.total_study_time, 0);
  const averageSessionTime = totalSessions > 0 ? Math.round(totalTimeSpent / totalSessions) : 0;

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}min`;
    }
    return `${mins}min`;
  };

  const progressToNextLevel = (xp / xpToNextLevel) * 100;

  return (
    <div className="flex items-start justify-center min-h-screen p-8">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Estatísticas</h1>
          <p className="text-muted-foreground">Acompanhe seu progresso e produtividade</p>
        </div>

        {/* Level Progress */}
        <div className="glass rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
                <Zap className="w-6 h-6 text-accent-foreground" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Level {level}</h2>
                <p className="text-sm text-muted-foreground">{xp} / {xpToNextLevel} XP</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-accent">{xpToNextLevel - xp}</p>
              <p className="text-xs text-muted-foreground">XP para próximo level</p>
            </div>
          </div>
          
          <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-accent to-yellow-400 transition-all duration-500"
              style={{ width: `${progressToNextLevel}%` }}
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Sessões Hoje */}
          <div className="glass rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-5 h-5 text-blue-400" />
              <span className="text-2xl font-bold text-white">{completedToday}</span>
            </div>
            <h3 className="text-sm font-medium text-white">Sessões Hoje</h3>
            <p className="text-xs text-muted-foreground">Pomodoros completados</p>
          </div>

          {/* Sequência Atual */}
          <div className="glass rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <span className="text-2xl font-bold text-white">{currentStreak}</span>
            </div>
            <h3 className="text-sm font-medium text-white">Sequência Atual</h3>
            <p className="text-xs text-muted-foreground">Dias consecutivos</p>
          </div>

          {/* Melhor Sequência */}
          <div className="glass rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-5 h-5 text-yellow-400" />
              <span className="text-2xl font-bold text-white">{longestStreak}</span>
            </div>
            <h3 className="text-sm font-medium text-white">Melhor Sequência</h3>
            <p className="text-xs text-muted-foreground">Recorde pessoal</p>
          </div>

          {/* Total de Sessões */}
          <div className="glass rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <BarChart3 className="w-5 h-5 text-purple-400" />
              <span className="text-2xl font-bold text-white">{totalSessions}</span>
            </div>
            <h3 className="text-sm font-medium text-white">Total de Sessões</h3>
            <p className="text-xs text-muted-foreground">Pomodoros completados</p>
          </div>
        </div>

        {/* Time Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Tempo Total */}
          <div className="glass rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Clock className="w-6 h-6 text-accent" />
              <h3 className="text-lg font-semibold text-white">Tempo de Estudo</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Tempo total estudado</span>
                <span className="text-xl font-bold text-white">{formatTime(totalTimeSpent)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Média por sessão</span>
                <span className="text-lg font-medium text-white">{averageSessionTime} min</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Tempo médio hoje</span>
                <span className="text-lg font-medium text-white">
                  {completedToday > 0 ? '25 min' : '0 min'}
                </span>
              </div>
            </div>
          </div>

          {/* Produtividade por Matéria */}
          <div className="glass rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <BarChart3 className="w-6 h-6 text-accent" />
              <h3 className="text-lg font-semibold text-white">Por Matéria</h3>
            </div>
            
            <div className="space-y-3">
              {subjects.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  Nenhuma matéria cadastrada ainda
                </p>
              ) : (
                subjects
                  .sort((a, b) => b.total_sessions - a.total_sessions)
                  .slice(0, 5)
                  .map((subject) => (
                    <div key={subject.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span>{subject.icon}</span>
                        <span className="text-sm text-white">{subject.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium text-white">
                          {subject.total_sessions} sessões
                        </span>
                        <div className="text-xs text-muted-foreground">
                          {formatTime(subject.total_study_time)}
                        </div>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>

        {/* Achievement Cards */}
        <div className="glass rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2 text-accent" />
            Conquistas
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Primeira Sessão */}
            <div className={`rounded-lg p-4 border ${
              totalSessions > 0 
                ? 'border-green-400 bg-green-400/10' 
                : 'border-border bg-muted/5'
            }`}>
              <div className="text-center">
                <div className="text-2xl mb-2">🎯</div>
                <h4 className="text-sm font-medium text-white">Primeira Sessão</h4>
                <p className="text-xs text-muted-foreground">Complete seu primeiro Pomodoro</p>
              </div>
            </div>

            {/* Sequência de 7 dias */}
            <div className={`rounded-lg p-4 border ${
              longestStreak >= 7 
                ? 'border-blue-400 bg-blue-400/10' 
                : 'border-border bg-muted/5'
            }`}>
              <div className="text-center">
                <div className="text-2xl mb-2">🔥</div>
                <h4 className="text-sm font-medium text-white">Semana Focada</h4>
                <p className="text-xs text-muted-foreground">7 dias consecutivos</p>
              </div>
            </div>

            {/* 50 Sessões */}
            <div className={`rounded-lg p-4 border ${
              totalSessions >= 50 
                ? 'border-purple-400 bg-purple-400/10' 
                : 'border-border bg-muted/5'
            }`}>
              <div className="text-center">
                <div className="text-2xl mb-2">⭐</div>
                <h4 className="text-sm font-medium text-white">Dedicação</h4>
                <p className="text-xs text-muted-foreground">50 sessões completadas</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};