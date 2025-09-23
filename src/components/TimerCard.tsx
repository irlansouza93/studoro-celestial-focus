import { Play, Pause, SkipForward, Zap, RotateCcw, Clock, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStudoroStore } from '@/hooks/useStudoroStore';
import { useTimer } from '@/hooks/useTimer';
import { useSupabaseSync } from '@/hooks/useSupabaseSync';
import { SubjectSelector } from './SubjectSelector';
import { toast } from 'sonner';

export const TimerCard = () => {
  const {
    timerStatus,
    timerMode,
    currentSession,
    currentStreak,
    completedToday,
    selectedSubjectId,
    sessionStartTime,
    startTimer,
    pauseTimer,
    resetTimer,
    setTimerMode,
  } = useStudoroStore();

  const { recordSession, subjects } = useSupabaseSync();
  const { formattedTime, progress } = useTimer();

  const handlePlayPause = () => {
    if (timerStatus === 'running') {
      pauseTimer();
    } else {
      // Para Pomodoro, exigir seleção de matéria
      if (timerMode === 'pomodoro' && !selectedSubjectId && subjects.length > 0) {
        toast.error('Selecione uma matéria para iniciar o Pomodoro');
        return;
      }
      startTimer(selectedSubjectId || undefined);
    }
  };

  const handleCompleteSession = async () => {
    if (!sessionStartTime || !selectedSubjectId) return;

    const endTime = new Date();
    const duration = Math.round((endTime.getTime() - sessionStartTime.getTime()) / (1000 * 60));

    try {
      await recordSession({
        subject_id: selectedSubjectId,
        session_type: timerMode === 'free' ? 'free' : timerMode === 'pomodoro' ? 'pomodoro' : 'break',
        started_at: sessionStartTime.toISOString(),
        ended_at: endTime.toISOString(),
        duration_minutes: Math.max(1, duration), // Mínimo 1 minuto
      });

      toast.success(`Sessão de ${duration} min registrada! +${duration} XP`);
      resetTimer();
    } catch (error) {
      console.error('Erro ao registrar sessão:', error);
      toast.error('Erro ao registrar sessão');
    }
  };

  const getModeLabel = () => {
    switch (timerMode) {
      case 'pomodoro':
        return 'Foco Total';
      case 'short-break':
        return 'Pausa Curta';
      case 'long-break':
        return 'Pausa Longa';
      case 'free':
        return 'Cronômetro Livre';
      default:
        return 'Foco Total';
    }
  };

  const getModeIcon = () => {
    switch (timerMode) {
      case 'pomodoro':
        return <Zap className="w-5 h-5 text-accent" />;
      case 'short-break':
        return <Pause className="w-5 h-5 text-green-400" />;
      case 'long-break':
        return <Pause className="w-5 h-5 text-blue-400" />;
      case 'free':
        return <Clock className="w-5 h-5 text-purple-400" />;
      default:
        return <Zap className="w-5 h-5 text-accent" />;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-8">
      <div className="w-full max-w-2xl space-y-6">
        
        {/* Subject Selector */}
        {(timerMode === 'pomodoro' || timerMode === 'free') && (
          <SubjectSelector />
        )}
        
        {/* Timer Mode Selector */}
        <div className="glass rounded-lg p-4">
          <div className="flex space-x-2">
            <Button
              onClick={() => setTimerMode('pomodoro')}
              variant={timerMode === 'pomodoro' ? 'default' : 'outline'}
              size="sm"
              className="flex-1"
            >
              🍅 Pomodoro
            </Button>
            <Button
              onClick={() => setTimerMode('free')}
              variant={timerMode === 'free' ? 'default' : 'outline'}
              size="sm"
              className="flex-1"
            >
              ⏱️ Livre
            </Button>
          </div>
        </div>

        {/* Main Timer Card */}
        <div className="glass rounded-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-2">
              {getModeIcon()}
              <h2 className="text-lg font-semibold text-white">{getModeLabel()}</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Sessão {currentSession} • Sequência {currentStreak}
            </p>
          </div>

          {/* Timer Display */}
          <div className="text-center mb-8">
            <div className="timer-display text-6xl font-light text-white mb-4">
              {formattedTime}
            </div>
            <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-1000" 
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <Button
              onClick={resetTimer}
              variant="ghost"
              size="lg"
              className="text-muted-foreground hover:text-white hover:bg-secondary"
            >
              <RotateCcw className="w-5 h-5" />
            </Button>
            
            <Button
              onClick={handlePlayPause}
              size="lg"
              className="w-16 h-16 rounded-full bg-primary hover:bg-primary-hover shadow-lg shadow-primary/25"
            >
              {timerStatus === 'running' ? (
                <Pause className="w-6 h-6 text-white" />
              ) : (
                <Play className="w-6 h-6 text-white ml-1" />
              )}
            </Button>
            
            {/* Complete Session Button */}
            {timerStatus === 'running' && timerMode !== 'pomodoro' && (
              <Button
                onClick={handleCompleteSession}
                variant="outline"
                size="lg"
                className="text-green-400 border-green-400 hover:bg-green-400 hover:text-white"
              >
                ✓ Finalizar
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="lg"
              className="text-muted-foreground hover:text-white hover:bg-secondary"
              onClick={() => {
                resetTimer();
                // Skip para próximo modo apenas no Pomodoro
                if (timerMode === 'pomodoro') {
                  const nextMode = currentSession % 4 === 0 ? 'long-break' : 'short-break';
                  setTimerMode(nextMode);
                } else if (timerMode === 'short-break' || timerMode === 'long-break') {
                  setTimerMode('pomodoro');
                }
              }}
            >
              <SkipForward className="w-5 h-5" />
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="glass rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-white mb-1">
                {completedToday}
              </div>
              <div className="text-xs text-muted-foreground">
                Completadas Hoje
              </div>
            </div>
            <div className="glass rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-white mb-1">
                {currentStreak}
              </div>
              <div className="text-xs text-muted-foreground">
                Sequência Atual
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};