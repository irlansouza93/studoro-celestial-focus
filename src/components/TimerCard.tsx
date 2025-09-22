import { Play, Pause, SkipForward, Zap } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export const TimerCard = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [time] = useState('25:00');
  const [sessionCount] = useState(1);
  const [streak] = useState(0);
  const [completedToday] = useState(0);
  const [currentStreak] = useState(0);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-8">
      <div className="glass rounded-2xl p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Zap className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-semibold text-white">Focus Time</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Session {sessionCount} • Streak {streak}
          </p>
        </div>

        {/* Timer Display */}
        <div className="text-center mb-8">
          <div className="timer-display text-6xl font-light text-white mb-4">
            {time}
          </div>
          <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
            <div className="w-0 h-full bg-gradient-to-r from-primary to-accent transition-all duration-1000" />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          <Button
            onClick={handlePlayPause}
            size="lg"
            className="w-16 h-16 rounded-full bg-primary hover:bg-primary-hover shadow-lg shadow-primary/25"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 text-white" />
            ) : (
              <Play className="w-6 h-6 text-white ml-1" />
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="lg"
            className="text-muted-foreground hover:text-white hover:bg-secondary"
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
              Completed Today
            </div>
          </div>
          <div className="glass rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-white mb-1">
              {currentStreak}
            </div>
            <div className="text-xs text-muted-foreground">
              Current Streak
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};