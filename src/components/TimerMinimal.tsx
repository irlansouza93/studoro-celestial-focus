import { useStudoroStore } from '@/hooks/useStudoroStore';
import { useTimer } from '@/hooks/useTimer';
import { useSupabaseSync } from '@/hooks/useSupabaseSync';
import { Play, Pause, X, Maximize2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StarField } from './StarField';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

interface TimerMinimalProps {
  mode: 'compact' | 'floating' | 'fullscreen';
  onModeChange: (mode: 'compact' | 'floating' | 'fullscreen') => void;
  onClose?: () => void;
  onPlayPause?: () => void;
  onComplete?: () => void;
}

export const TimerMinimal = ({ mode, onModeChange, onClose, onPlayPause, onComplete }: TimerMinimalProps) => {
  const {
    timerStatus,
    timerMode,
    selectedSubjectId,
    sessionStartTime,
  } = useStudoroStore();

  const { subjects } = useSupabaseSync();
  const { formattedTime } = useTimer();
  
  const [position, setPosition] = useState({ x: window.innerWidth - 200, y: window.innerHeight - 200 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const selectedSubject = subjects.find(s => s.id === selectedSubjectId);

  // Drag handlers para floating
  const handleMouseDown = (e: React.MouseEvent) => {
    if (mode !== 'floating') return;
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || mode !== 'floating') return;
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, mode]);

  if (mode === 'fullscreen') {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background animate-fade-in">
        <StarField />
        <div className="relative z-10 text-center animate-scale-in transition-all duration-300 ease-out">
          <div className="glass rounded-3xl p-12 backdrop-blur-xl">
            <div className="timer-display text-8xl font-light text-white mb-6">
              {formattedTime}
            </div>
            {selectedSubject && (
              <p className="text-lg text-muted-foreground mb-8">
                {selectedSubject.icon} {selectedSubject.name}
              </p>
            )}
            <div className="flex items-center justify-center space-x-4">
              <Button
                onClick={onPlayPause}
                size="lg"
                variant="outline"
                className="w-12 h-12 rounded-full"
              >
                {timerStatus === 'running' ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
              </Button>
              
              {(timerStatus === 'running' || sessionStartTime) && (
                <Button
                  onClick={onComplete}
                  variant="outline"
                  size="lg"
                  className="text-green-400 border-green-400 hover:bg-green-400 hover:text-white"
                >
                  ✓
                </Button>
              )}
              
              <Button
                onClick={() => onModeChange('compact')}
                variant="ghost"
                size="lg"
                className="text-muted-foreground hover:text-white"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Voltar
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'floating') {
    return (
      <div 
        className="fixed z-[99999] cursor-move animate-scale-in"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          pointerEvents: 'auto'
        }}
        onMouseDown={handleMouseDown}
      >
        <div className="glass rounded-lg p-3 min-w-[180px] shadow-2xl shadow-primary/20 backdrop-blur-xl border border-white/10 transition-all duration-300 ease-out">
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
              onClick={onPlayPause}
              size="sm"
              variant="outline"
              className="w-8 h-8 p-0 rounded-full"
            >
              {timerStatus === 'running' ? (
                <Pause className="w-3 h-3" />
              ) : (
                <Play className="w-3 h-3" />
              )}
            </Button>
            
            {(timerStatus === 'running' || sessionStartTime) && (
              <Button
                onClick={onComplete}
                size="sm"
                variant="outline"
                className="w-6 h-6 p-0 text-green-400 border-green-400"
              >
                ✓
              </Button>
            )}
            
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
    <div className="h-screen overflow-y-auto animate-fade-in">
      <div className="flex items-center justify-center min-h-screen p-8">
        <div className="w-full max-w-2xl">
          <div className="glass rounded-2xl p-8 animate-scale-in transition-all duration-300 ease-out">
            <div className="text-center">
              <div className="timer-display text-6xl font-light text-white mb-6">
                {formattedTime}
              </div>
              {selectedSubject && (
                <p className="text-lg text-muted-foreground mb-8">
                  {selectedSubject.icon} {selectedSubject.name}
                </p>
              )}
              
              <div className="flex items-center justify-center space-x-4">
                <Button
                  onClick={onPlayPause}
                  size="lg"
                  className="w-16 h-16 rounded-full bg-primary hover:bg-primary-hover shadow-lg shadow-primary/25"
                >
                  {timerStatus === 'running' ? (
                    <Pause className="w-6 h-6 text-white" />
                  ) : (
                    <Play className="w-6 h-6 text-white ml-1" />
                  )}
                </Button>
                
                {(timerStatus === 'running' || sessionStartTime) && (
                  <Button
                    onClick={onComplete}
                    variant="outline"
                    size="lg"
                    className="text-green-400 border-green-400 hover:bg-green-400 hover:text-white"
                  >
                    ✓ Finalizar
                  </Button>
                )}
                
                <Button
                  onClick={onClose}
                  variant="ghost"
                  size="lg"
                  className="text-muted-foreground hover:text-white hover:bg-secondary"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Voltar
                </Button>
                
                <Button
                  onClick={() => onModeChange('floating')}
                  variant="ghost"
                  size="lg"
                  className="text-muted-foreground hover:text-white hover:bg-secondary"
                >
                  PiP
                </Button>
                
                <Button
                  onClick={() => onModeChange('fullscreen')}
                  variant="ghost"
                  size="lg"
                  className="text-muted-foreground hover:text-white hover:bg-secondary"
                >
                  <Maximize2 className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};