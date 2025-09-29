import { useStudoroStore } from '@/hooks/useStudoroStore';
import { useTimer } from '@/hooks/useTimer';
import { useSupabaseSync } from '@/hooks/useSupabaseSync';
import { Play, Pause, X, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TimerMinimalProps {
  mode: 'compact' | 'floating' | 'fullscreen';
  onModeChange: (mode: 'compact' | 'floating' | 'fullscreen') => void;
  onClose?: () => void;
}

export const TimerMinimal = ({ mode, onModeChange, onClose }: TimerMinimalProps) => {
  const {
    timerStatus,
    timerMode,
    selectedSubjectId,
    startTimer,
    pauseTimer,
  } = useStudoroStore();

  const { subjects } = useSupabaseSync();
  const { formattedTime } = useTimer();

  const selectedSubject = subjects.find(s => s.id === selectedSubjectId);

  const handlePlayPause = () => {
    if (timerStatus === 'running') {
      pauseTimer();
    } else {
      startTimer(selectedSubjectId || undefined);
    }
  };

  if (mode === 'fullscreen') {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="timer-display text-3xl font-light text-white mb-4">
            {formattedTime}
          </div>
          {selectedSubject && (
            <p className="text-xs text-muted-foreground mb-4">
              {selectedSubject.icon} {selectedSubject.name}
            </p>
          )}
          <div className="flex items-center justify-center space-x-2">
            <Button
              onClick={handlePlayPause}
              size="sm"
              className="w-8 h-8 rounded-full"
            >
              {timerStatus === 'running' ? (
                <Pause className="w-3 h-3" />
              ) : (
                <Play className="w-3 h-3 ml-0.5" />
              )}
            </Button>
            <Button
              onClick={() => onModeChange('compact')}
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-white"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'floating') {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <div className="glass rounded-lg p-3 min-w-[160px] shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="timer-display text-lg font-mono text-white">
              {formattedTime}
            </div>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="w-6 h-6 p-0 text-muted-foreground hover:text-white"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
          
          {selectedSubject && (
            <p className="text-xs text-muted-foreground mb-2 truncate">
              {selectedSubject.icon} {selectedSubject.name}
            </p>
          )}
          
          <div className="flex items-center justify-center space-x-2">
            <Button
              onClick={handlePlayPause}
              size="sm"
              className="w-8 h-8 p-0 rounded-full"
            >
              {timerStatus === 'running' ? (
                <Pause className="w-3 h-3" />
              ) : (
                <Play className="w-3 h-3 ml-0.5" />
              )}
            </Button>
            <Button
              onClick={() => onModeChange('fullscreen')}
              variant="ghost"
              size="sm"
              className="w-6 h-6 p-0 text-muted-foreground hover:text-white"
            >
              <Maximize2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl p-6">
      <div className="text-center">
        <div className="timer-display text-4xl font-light text-white mb-4">
          {formattedTime}
        </div>
        {selectedSubject && (
          <p className="text-sm text-muted-foreground mb-4">
            {selectedSubject.icon} {selectedSubject.name}
          </p>
        )}
        
        <div className="flex items-center justify-center space-x-4">
          <Button
            onClick={handlePlayPause}
            size="lg"
            className="w-12 h-12 rounded-full"
          >
            {timerStatus === 'running' ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 ml-0.5" />
            )}
          </Button>
          
          <Button
            onClick={() => onModeChange('floating')}
            variant="outline"
            size="sm"
            className="text-muted-foreground"
          >
            PiP
          </Button>
          
          <Button
            onClick={() => onModeChange('fullscreen')}
            variant="outline"
            size="sm"
            className="text-muted-foreground"
          >
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};