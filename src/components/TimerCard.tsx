import { Play, Pause, SkipForward, Zap, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStudoroStore } from '@/hooks/useStudoroStore';
import { useTimer } from '@/hooks/useTimer';

export const TimerCard = () => {
  const {
    timerStatus,
    timerMode,
    currentSession,
    currentStreak,
    completedToday,
    startTimer,
    pauseTimer,
    resetTimer,
  } = useStudoroStore();

  const { formattedTime, progress } = useTimer();

  const handlePlayPause = () => {
    if (timerStatus === 'running') {
      pauseTimer();
    } else {
      startTimer();
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
      default:
        return <Zap className="w-5 h-5 text-accent" />;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-8">
      <div className="glass rounded-2xl p-8 w-full max-w-md">
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
          
          <Button
            variant="ghost"
            size="lg"
            className="text-muted-foreground hover:text-white hover:bg-secondary"
            onClick={() => {
              resetTimer();
              // Skip para próximo modo
              if (timerMode === 'pomodoro') {
                const nextMode = currentSession % 4 === 0 ? 'long-break' : 'short-break';
                useStudoroStore.getState().setTimerMode(nextMode);
              } else {
                useStudoroStore.getState().setTimerMode('pomodoro');
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
  );
};