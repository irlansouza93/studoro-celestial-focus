import { Target, TrendingUp, Calendar } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { format, startOfWeek, endOfWeek } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Subject, StudySession } from '@/hooks/useSupabaseSync';

interface GoalsProgressProps {
  subjects: Subject[];
  sessions: StudySession[];
}

export const GoalsProgress = ({ subjects, sessions }: GoalsProgressProps) => {
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

  // Calcular progresso semanal por matéria
  const getWeeklyProgress = (subjectId: string, targetHours: number) => {
    const weekSessions = sessions.filter(session => {
      const sessionDate = new Date(session.started_at);
      return session.subject_id === subjectId && 
             sessionDate >= weekStart && 
             sessionDate <= weekEnd;
    });

    const weeklyMinutes = weekSessions.reduce((sum, s) => sum + s.duration_minutes, 0);
    const weeklyHours = weeklyMinutes / 60;
    const progress = targetHours > 0 ? (weeklyHours / targetHours) * 100 : 0;

    return {
      weeklyHours,
      weeklyMinutes,
      progress: Math.min(progress, 100),
      isCompleted: progress >= 100,
      sessionsCount: weekSessions.length
    };
  };

  // Filtrar apenas matérias com metas definidas
  const subjectsWithGoals = subjects.filter(subject => subject.target_hours_per_week > 0);

  // Meta global semanal
  const totalWeeklyGoal = subjectsWithGoals.reduce((sum, s) => sum + s.target_hours_per_week, 0);
  const totalWeeklyAchieved = subjectsWithGoals.reduce((sum, subject) => {
    const progress = getWeeklyProgress(subject.id, subject.target_hours_per_week);
    return sum + progress.weeklyHours;
  }, 0);
  
  const globalProgress = totalWeeklyGoal > 0 ? (totalWeeklyAchieved / totalWeeklyGoal) * 100 : 0;

  if (subjectsWithGoals.length === 0) {
    return (
      <div className="glass rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Target className="w-5 h-5 mr-2 text-primary" />
          Metas Semanais
        </h3>
        <div className="text-center py-8">
          <Target className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">Nenhuma meta semanal definida ainda</p>
          <p className="text-sm text-muted-foreground mt-2">
            Configure metas na página de matérias para acompanhar seu progresso
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Meta Global */}
      <div className="glass rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Target className="w-5 h-5 mr-2 text-primary" />
          Meta Global da Semana
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {format(weekStart, 'dd/MM', { locale: ptBR })} - {format(weekEnd, 'dd/MM', { locale: ptBR })}
            </span>
            <div className="flex items-center space-x-2">
              <TrendingUp className={`w-4 h-4 ${globalProgress >= 100 ? 'text-green-400' : 'text-yellow-400'}`} />
              <span className="text-sm font-medium text-white">
                {globalProgress.toFixed(1)}%
              </span>
            </div>
          </div>
          
          <Progress value={globalProgress} className="h-3" />
          
          <div className="flex justify-between text-sm">
            <span className="text-white font-medium">
              {totalWeeklyAchieved.toFixed(1)}h / {totalWeeklyGoal}h
            </span>
            <span className={`font-medium ${
              globalProgress >= 100 ? 'text-green-400' : 
              globalProgress >= 75 ? 'text-yellow-400' : 'text-muted-foreground'
            }`}>
              {globalProgress >= 100 ? 'Meta atingida!' : 
               globalProgress >= 75 ? 'Quase lá!' : 
               `Faltam ${(totalWeeklyGoal - totalWeeklyAchieved).toFixed(1)}h`}
            </span>
          </div>
        </div>
      </div>

      {/* Metas por Matéria */}
      <div className="glass rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Progresso por Matéria</h3>
        
        <div className="space-y-4">
          {subjectsWithGoals.map(subject => {
            const progress = getWeeklyProgress(subject.id, subject.target_hours_per_week);
            
            return (
              <div key={subject.id} className="bg-muted/5 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{subject.icon}</span>
                    <span className="font-medium text-white">{subject.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Target className={`w-4 h-4 ${
                      progress.isCompleted ? 'text-green-400' : 
                      progress.progress >= 75 ? 'text-yellow-400' : 'text-muted-foreground'
                    }`} />
                    <span className="text-sm font-medium text-white">
                      {progress.progress.toFixed(1)}%
                    </span>
                  </div>
                </div>
                
                <Progress value={progress.progress} className="h-2 mb-2" />
                
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">
                    {progress.weeklyHours.toFixed(1)}h / {subject.target_hours_per_week}h
                  </span>
                  <span className="text-muted-foreground">
                    {progress.sessionsCount} sessões esta semana
                  </span>
                </div>
                
                {progress.isCompleted && (
                  <div className="mt-2 text-xs text-green-400 flex items-center">
                    <Target className="w-3 h-3 mr-1" />
                    Meta semanal concluída!
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};