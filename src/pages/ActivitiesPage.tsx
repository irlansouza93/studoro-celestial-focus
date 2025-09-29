import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Clock, Calendar, TrendingUp } from 'lucide-react';
import { useSupabaseSync } from '@/hooks/useSupabaseSync';
import { ActivityCalendar } from '@/components/ActivityCalendar';
import { useStudoroStore } from '@/hooks/useStudoroStore';

export const ActivitiesPage = () => {
  const { recentSessions: sessions, subjects } = useSupabaseSync();
  const { currentStreak, longestStreak } = useStudoroStore();

  // Ordenar sessões por data (mais recente primeiro)
  const recentSessions = [...sessions]
    .sort((a, b) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime())
    .slice(0, 20);

  const getMoodEmoji = (mood?: string) => {
    switch (mood) {
      case 'excellent': return '😄';
      case 'good': return '😊';
      case 'neutral': return '😐';
      case 'tired': return '😴';
      case 'frustrated': return '😤';
      default: return '📝';
    }
  };

  const getSessionTypeLabel = (type: string) => {
    switch (type) {
      case 'pomodoro': return '🍅 Pomodoro';
      case 'free': return '⏱️ Cronômetro';
      case 'break': return '☕ Pausa';
      default: return type;
    }
  };

  return (
    <div className="h-screen overflow-y-auto scrollbar-hide">
      <div className="flex items-start justify-center min-h-screen p-8">
        <div className="w-full max-w-5xl space-y-6">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2">Atividades</h1>
            <p className="text-muted-foreground">Acompanhe seu histórico de estudos e progresso</p>
          </div>

          {/* Streak Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass rounded-2xl p-6 text-center">
              <div className="text-3xl mb-2">🔥</div>
              <div className="text-3xl font-bold text-white mb-1">{currentStreak}</div>
              <div className="text-sm text-muted-foreground">Ofensiva Atual</div>
            </div>
            
            <div className="glass rounded-2xl p-6 text-center">
              <div className="text-3xl mb-2">🏆</div>
              <div className="text-3xl font-bold text-white mb-1">{longestStreak}</div>
              <div className="text-sm text-muted-foreground">Melhor Ofensiva</div>
            </div>
            
            <div className="glass rounded-2xl p-6 text-center">
              <div className="text-3xl mb-2">📚</div>
              <div className="text-3xl font-bold text-white mb-1">{sessions.length}</div>
              <div className="text-sm text-muted-foreground">Total de Sessões</div>
            </div>
          </div>

          {/* Calendar */}
          <ActivityCalendar />

          {/* Recent Sessions */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Clock className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold text-white">Sessões Recentes</h2>
            </div>

            {recentSessions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-2">Nenhuma sessão registrada ainda.</p>
                <p className="text-sm text-muted-foreground">
                  Comece uma sessão de estudo na aba Pomodoro!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentSessions.map((session) => {
                  const subject = subjects.find(s => s.id === session.subject_id);
                  const hasNotes = session.notes || session.mood || session.had_exercises;

                  return (
                    <div
                      key={session.id}
                      className="glass rounded-lg p-4 hover:bg-secondary/30 transition-all"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">
                            {subject?.icon || '📚'}
                          </div>
                          <div>
                            <h3 className="text-white font-medium">
                              {subject?.name || 'Sem matéria'}
                            </h3>
                            <div className="flex items-center space-x-3 text-xs text-muted-foreground mt-1">
                              <span>{getSessionTypeLabel(session.session_type)}</span>
                              <span>•</span>
                              <span>{session.duration_minutes} minutos</span>
                              <span>•</span>
                              <span>
                                {format(new Date(session.started_at), "d 'de' MMM 'às' HH:mm", { locale: ptBR })}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {session.mood && (
                            <span className="text-xl" title="Humor">
                              {getMoodEmoji(session.mood)}
                            </span>
                          )}
                          <div className="text-accent text-sm font-medium">
                            +{session.xp_earned || session.duration_minutes} XP
                          </div>
                        </div>
                      </div>

                      {/* Notes */}
                      {session.notes && (
                        <div className="mt-3 pl-11">
                          <div className="bg-secondary/30 rounded-lg p-3 text-sm text-muted-foreground">
                            {session.notes}
                          </div>
                        </div>
                      )}

                      {/* Exercises */}
                      {session.had_exercises && (
                        <div className="mt-3 pl-11 flex items-center space-x-4 text-xs">
                          <span className="text-green-400">
                            ✓ {session.correct_answers || 0} acertos
                          </span>
                          <span className="text-red-400">
                            ✗ {session.wrong_answers || 0} erros
                          </span>
                          {session.correct_answers && session.wrong_answers && (
                            <span className="text-muted-foreground">
                              ({Math.round((session.correct_answers / (session.correct_answers + session.wrong_answers)) * 100)}% de aproveitamento)
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
