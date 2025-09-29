import { Play, Pause, SkipForward, Zap, RotateCcw, Clock, PictureInPicture, Maximize2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useStudoroStore } from '@/hooks/useStudoroStore';
import { useTimer } from '@/hooks/useTimer';
import { useSupabaseSync } from '@/hooks/useSupabaseSync';
import { SubjectSelector } from './SubjectSelector';
import { TimerMinimal } from './TimerMinimal';
import { SessionNotesDialog, SessionNotes } from './SessionNotesDialog';
import { toast } from 'sonner';

export const TimerCard = () => {
  const [viewMode, setViewMode] = useState<'full' | 'compact' | 'floating' | 'fullscreen'>('full');
  const [showNotesDialog, setShowNotesDialog] = useState(false);
  const [pendingSessionData, setPendingSessionData] = useState<{
    duration: number;
    subjectName: string;
    sessionData: any;
  } | null>(null);

  const {
    timerStatus,
    timerMode,
    timeRemaining,
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

  const handleCompleteSession = async (skipNotes = false) => {
    if (!sessionStartTime || !selectedSubjectId) return;

    const endTime = new Date();
    const duration = Math.round((endTime.getTime() - sessionStartTime.getTime()) / (1000 * 60));
    const selectedSubject = subjects.find(s => s.id === selectedSubjectId);

    const sessionData = {
      subject_id: selectedSubjectId,
      session_type: (timerMode === 'free' ? 'free' : timerMode === 'pomodoro' ? 'pomodoro' : 'break') as 'pomodoro' | 'free' | 'break',
      started_at: sessionStartTime.toISOString(),
      ended_at: endTime.toISOString(),
      duration_minutes: Math.max(1, duration),
    };

    if (skipNotes || timerMode === 'pomodoro') {
      // Registra diretamente sem anotações
      try {
        await recordSession(sessionData);
        toast.success(`Sessão de ${duration} min registrada! +${duration} XP`);
        resetTimer();
      } catch (error) {
        console.error('Erro ao registrar sessão:', error);
        toast.error('Erro ao registrar sessão');
      }
    } else {
      // Abre dialog de anotações para cronômetro livre
      setPendingSessionData({
        duration,
        subjectName: selectedSubject?.name || 'Sem matéria',
        sessionData
      });
      setShowNotesDialog(true);
    }
  };

  const handleSaveSessionWithNotes = async (notes: SessionNotes) => {
    if (!pendingSessionData) return;

    try {
      await recordSession({
        ...pendingSessionData.sessionData,
        notes: notes.notes,
        mood: notes.mood,
        had_exercises: notes.hadExercises,
        correct_answers: notes.correctAnswers,
        wrong_answers: notes.wrongAnswers,
      });
      
      toast.success(`Sessão de ${pendingSessionData.duration} min registrada! +${pendingSessionData.duration} XP`);
      resetTimer();
      setPendingSessionData(null);
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
        return 'Cronômetro';
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

  // Renderizar timer minimalista quando em execução
  const showMinimal = timerStatus === 'running' && viewMode !== 'full';
  const isRunningPomodoro = timerStatus === 'running' && timerMode === 'pomodoro';
  const isRunningFree = timerStatus === 'running' && timerMode === 'free';

  // Se timer está rodando em modo compacto/floating/fullscreen
  if (viewMode !== 'full') {
    return (
      <>
        <TimerMinimal 
          mode={viewMode}
          onModeChange={setViewMode}
          onClose={() => setViewMode('full')}
        />
        
        <SessionNotesDialog
          open={showNotesDialog}
          onOpenChange={setShowNotesDialog}
          onSave={handleSaveSessionWithNotes}
          sessionDuration={pendingSessionData?.duration || 0}
          subjectName={pendingSessionData?.subjectName || ''}
        />
      </>
    );
  }

  return (
    <div className="h-screen overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-8">
        <div className="w-full max-w-2xl space-y-6">
          
          {/* Subject Selector - só mostra se não estiver rodando */}
          {!isRunningPomodoro && !isRunningFree && (timerMode === 'pomodoro' || timerMode === 'free') && (
            <SubjectSelector />
          )}
          
          {/* Timer Mode Selector - só mostra se não estiver rodando */}
          {!isRunningPomodoro && !isRunningFree && (
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
                  ⏱️ Cronômetro
                </Button>
              </div>
            </div>
          )}

          {/* Main Timer Card */}
          <div className="glass rounded-2xl p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-2 mb-2">
                {getModeIcon()}
                <h2 className="text-lg font-semibold text-white">{getModeLabel()}</h2>
              </div>
              
              {/* Subject info quando rodando */}
              {(isRunningPomodoro || isRunningFree) && selectedSubjectId && (
                <p className="text-sm text-muted-foreground mb-2">
                  {subjects.find(s => s.id === selectedSubjectId)?.icon} {subjects.find(s => s.id === selectedSubjectId)?.name}
                </p>
              )}
              
              {!isRunningPomodoro && !isRunningFree && (
                <p className="text-sm text-muted-foreground">
                  Sessão {currentSession} • Sequência {currentStreak}
                </p>
              )}
            </div>

            {/* Timer Display */}
            <div className="text-center mb-8">
              <div className="timer-display text-6xl font-light text-white mb-4">
                {formattedTime}
              </div>
              {timerMode === 'pomodoro' && (
                <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-1000" 
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}
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
              
              {/* Complete Session Button - sempre disponível para cronômetro livre */}
              {(timerStatus === 'running' || (timerMode === 'free' && sessionStartTime)) && (
                <Button
                  onClick={() => handleCompleteSession()}
                  variant="outline"
                  size="lg"
                  className="text-green-400 border-green-400 hover:bg-green-400 hover:text-white"
                >
                  ✓ Finalizar
                </Button>
              )}
              
              {/* View Mode Controls */}
              {timerStatus === 'running' && (
                <>
                  <Button
                    onClick={() => setViewMode('floating')}
                    variant="ghost"
                    size="lg"
                    className="text-muted-foreground hover:text-white hover:bg-secondary"
                  >
                    <PictureInPicture className="w-5 h-5" />
                  </Button>
                  
                  <Button
                    onClick={() => setViewMode('fullscreen')}
                    variant="ghost"
                    size="lg"
                    className="text-muted-foreground hover:text-white hover:bg-secondary"
                  >
                    <Maximize2 className="w-5 h-5" />
                  </Button>
                </>
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

            {/* Stats - só mostra se não estiver rodando */}
            {!isRunningPomodoro && !isRunningFree && (
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
            )}
          </div>
        </div>
        
        <SessionNotesDialog
          open={showNotesDialog}
          onOpenChange={setShowNotesDialog}
          onSave={handleSaveSessionWithNotes}
          sessionDuration={pendingSessionData?.duration || 0}
          subjectName={pendingSessionData?.subjectName || ''}
        />
      </div>
    </div>
  );
};