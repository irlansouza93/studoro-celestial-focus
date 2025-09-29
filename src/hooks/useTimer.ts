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
    if (timerStatus === 'running') {
      intervalRef.current = setInterval(() => {
        useStudoroStore.setState((state) => {
          // Para Pomodoro, conta regressiva
          if (state.timerMode === 'pomodoro' || state.timerMode === 'short-break' || state.timerMode === 'long-break') {
            const newTime = state.timeRemaining - 1;
            
            // Se chegou a zero, completar sessão
            if (newTime <= 0) {
              setTimeout(() => {
                state.completeSession();
              }, 100);
              
              return { timeRemaining: 0, timerStatus: 'idle' };
            }
            
            return { timeRemaining: newTime };
          } else {
            // Para cronômetro livre, conta progressiva
            return { timeRemaining: state.timeRemaining + 1 };
          }
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
  }, [timerStatus]);
  
  // Formatação do tempo
  const formatTime = (seconds: number) => {
    if (timerMode === 'free') {
      // Cronômetro: formato HH:MM:SS contando para cima
      const hours = Math.floor(seconds / 3600);
      const mins = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
      return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
      // Pomodoro: formato MM:SS contando para baixo
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
  };
  
  const progress = () => {
    if (timerMode === 'free') return 0; // Não mostra progress no cronômetro
    
    const totalTime = timerMode === 'pomodoro' ? 25 * 60 : 
                     timerMode === 'short-break' ? 5 * 60 : 15 * 60;
    return ((totalTime - timeRemaining) / totalTime) * 100;
  };
  
  return {
    formattedTime: formatTime(timeRemaining),
    progress: progress(),
  };
};