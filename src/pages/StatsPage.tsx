import { BarChart3, Clock, Zap, Target, TrendingUp, Calendar, Activity } from 'lucide-react';
import { useState } from 'react';
import { useStudoroStore } from '@/hooks/useStudoroStore';
import { useSupabaseSync } from '@/hooks/useSupabaseSync';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { TimelineChart } from '@/components/analytics/TimelineChart';
import { SubjectDistribution } from '@/components/analytics/SubjectDistribution';
import { StudyHeatmap } from '@/components/analytics/StudyHeatmap';
import { ProductivityMetrics } from '@/components/analytics/ProductivityMetrics';
import { GoalsProgress } from '@/components/analytics/GoalsProgress';
import { ExportControls } from '@/components/analytics/ExportControls';

export const StatsPage = () => {
  const [timelinePeriod, setTimelinePeriod] = useState<'week' | 'month' | '3months'>('week');
  
  const {
    level,
    xp,
    xpToNextLevel,
    completedToday,  
    currentStreak,
    longestStreak,
    totalSessions,
  } = useStudoroStore();
  
  const { subjects, profile, recentSessions, loading } = useSupabaseSync();

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="glass rounded-lg p-8 text-center">
          <Activity className="w-8 h-8 text-primary mx-auto mb-4 animate-spin" />
          <p className="text-muted-foreground">Carregando analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-y-auto">
      <div className="flex items-start justify-center min-h-screen p-6">
        <div className="w-full max-w-6xl">
          {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Analytics Avançado</h1>
          <p className="text-muted-foreground">Dashboard completo de produtividade e insights</p>
        </div>

        {/* Level Progress Summary */}
        <div className="glass rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                <Zap className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Level {level}</h2>
                <p className="text-sm text-muted-foreground">{xp} / {xpToNextLevel} XP</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">{xpToNextLevel - xp}</p>
              <p className="text-xs text-muted-foreground">XP para próximo level</p>
            </div>
          </div>
          
          <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-yellow-400 transition-all duration-500"
              style={{ width: `${progressToNextLevel}%` }}
            />
          </div>
        </div>

        {/* Analytics Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="timeline">Linha Temporal</TabsTrigger>
            <TabsTrigger value="subjects">Por Matéria</TabsTrigger>
            <TabsTrigger value="goals">Metas</TabsTrigger>
            <TabsTrigger value="export">Exportar</TabsTrigger>
          </TabsList>

          {/* Visão Geral */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ProductivityMetrics sessions={recentSessions} profile={profile} />
            </div>
            
            <StudyHeatmap sessions={recentSessions} />
          </TabsContent>

          {/* Linha Temporal */}
          <TabsContent value="timeline" className="space-y-6">
            <div className="flex justify-center space-x-2 mb-6">
              <Button
                variant={timelinePeriod === 'week' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimelinePeriod('week')}
              >
                Semana
              </Button>
              <Button
                variant={timelinePeriod === 'month' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimelinePeriod('month')}
              >
                Mês
              </Button>
              <Button
                variant={timelinePeriod === '3months' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimelinePeriod('3months')}
              >
                3 Meses
              </Button>
            </div>
            
            <TimelineChart sessions={recentSessions} period={timelinePeriod} />
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="glass rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <Calendar className="w-4 h-4 text-blue-400" />
                  <span className="text-xl font-bold text-white">{completedToday}</span>
                </div>
                <h3 className="text-xs font-medium text-white">Sessões Hoje</h3>
                <p className="text-[10px] text-muted-foreground">Pomodoros completados</p>
              </div>

              <div className="glass rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-xl font-bold text-white">{currentStreak}</span>
                </div>
                <h3 className="text-xs font-medium text-white">Sequência Atual</h3>
                <p className="text-[10px] text-muted-foreground">Dias consecutivos</p>
              </div>

              <div className="glass rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <Target className="w-4 h-4 text-yellow-400" />
                  <span className="text-xl font-bold text-white">{longestStreak}</span>
                </div>
                <h3 className="text-xs font-medium text-white">Melhor Sequência</h3>
                <p className="text-[10px] text-muted-foreground">Recorde pessoal</p>
              </div>

              <div className="glass rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <BarChart3 className="w-4 h-4 text-purple-400" />
                  <span className="text-xl font-bold text-white">{totalSessions}</span>
                </div>
                <h3 className="text-xs font-medium text-white">Total de Sessões</h3>
                <p className="text-[10px] text-muted-foreground">Pomodoros completados</p>
              </div>
            </div>
          </TabsContent>

          {/* Por Matéria */}
          <TabsContent value="subjects" className="space-y-6">
            <SubjectDistribution subjects={subjects} />
            
            <div className="glass rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <BarChart3 className="w-6 h-6 text-primary" />
                <h3 className="text-lg font-semibold text-white">Ranking de Matérias</h3>
              </div>
              
              <div className="space-y-3">
                {subjects.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    Nenhuma matéria cadastrada ainda
                  </p>
                ) : (
                  subjects
                    .sort((a, b) => b.total_sessions - a.total_sessions)
                    .map((subject, index) => (
                      <div key={subject.id} className="flex items-center justify-between bg-muted/5 rounded-lg p-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                            {index + 1}
                          </div>
                          <span className="text-lg">{subject.icon}</span>
                          <span className="text-sm text-white font-medium">{subject.name}</span>
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
          </TabsContent>

          {/* Metas */}
          <TabsContent value="goals" className="space-y-6">
            <GoalsProgress subjects={subjects} sessions={recentSessions} />
          </TabsContent>

          {/* Exportar */}
          <TabsContent value="export" className="space-y-6">
            <ExportControls 
              subjects={subjects} 
              sessions={recentSessions} 
              profile={profile} 
            />
          </TabsContent>
        </Tabs>
        </div>
      </div>
    </div>
  );
};