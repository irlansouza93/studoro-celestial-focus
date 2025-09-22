import { useEffect, useRef } from 'react';
import { useStudoroStore } from './useStudoroStore';

export const useTimer = () => {
  const {
    timeRemaining,
    timerStatus,
    timerMode,
    completeSession,
  } = useStudoroStore();
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    if (timerStatus === 'running' && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        useStudoroStore.setState((state) => {
          const newTime = state.timeRemaining - 1;
          
          // Se chegou a zero, completar sessão
          if (newTime <= 0) {
            setTimeout(() => {
              state.completeSession();
            }, 100);
            
            return { timeRemaining: 0, timerStatus: 'idle' };
          }
          
          return { timeRemaining: newTime };
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timerStatus, timeRemaining]);
  
  // Formatação do tempo
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const progress = () => {
    const totalTime = timerMode === 'pomodoro' ? 25 * 60 : 
                     timerMode === 'short-break' ? 5 * 60 : 15 * 60;
    return ((totalTime - timeRemaining) / totalTime) * 100;
  };
  
  return {
    formattedTime: formatTime(timeRemaining),
    progress: progress(),
  };
};