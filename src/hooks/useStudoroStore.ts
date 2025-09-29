import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useSupabaseSync } from './useSupabaseSync';

export type TimerMode = 'pomodoro' | 'short-break' | 'long-break' | 'free';
export type TimerStatus = 'idle' | 'running' | 'paused';

export interface StudoroState {
  // Timer State
  timeRemaining: number; // em segundos
  timerMode: TimerMode;
  timerStatus: TimerStatus;
  currentSession: number;
  
  // Gamificação
  level: number;
  xp: number;
  xpToNextLevel: number;
  completedToday: number;
  currentStreak: number;
  longestStreak: number;
  totalSessions: number;
  
  // Navegação
  currentPage: string;
  
  // Timer State - Enhanced
  selectedSubjectId: string | null;
  sessionStartTime: Date | null;
  
  // Tarefas (mantendo local por enquanto)
  tasks: Array<{
    id: string;
    title: string;
    completed: boolean;
    subjectId?: string;
    priority: 'low' | 'medium' | 'high';
    createdAt: Date;
  }>;
  
  // Actions - Enhanced
  startTimer: (subjectId?: string) => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  completeSession: () => void;
  completeCurrentSession: () => void;
  setTimerMode: (mode: TimerMode) => void;
  setCurrentPage: (page: string) => void;
  setSelectedSubject: (id: string | null) => void;
  addXP: (amount: number) => void;
  addTask: (task: Omit<StudoroState['tasks'][0], 'id' | 'createdAt'>) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
}

const POMODORO_TIME = 25 * 60; // 25 minutos
const SHORT_BREAK_TIME = 5 * 60; // 5 minutos
const LONG_BREAK_TIME = 15 * 60; // 15 minutos
const FREE_TIMER_TIME = 60 * 60; // 1 hora inicial para cronômetro livre

export const useStudoroStore = create<StudoroState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      timeRemaining: POMODORO_TIME,
      timerMode: 'pomodoro',
      timerStatus: 'idle',
      currentSession: 1,
      
      level: 1,
      xp: 0,
      xpToNextLevel: 100,
      completedToday: 0,
      currentStreak: 0,
      longestStreak: 0,
      totalSessions: 0,
      
      currentPage: 'timer',
      
      // Enhanced timer state
      selectedSubjectId: null,
      sessionStartTime: null,
      
      tasks: [
        {
          id: '1',
          title: 'Estudar para prova de matemática',
          completed: false,
          subjectId: '1',
          priority: 'high',
          createdAt: new Date(),
        },
        {
          id: '2',
          title: 'Ler capítulo 5 de português',
          completed: false,
          subjectId: '2',
          priority: 'medium',
          createdAt: new Date(),
        },
      ],
      
      // Actions - Enhanced
      startTimer: (subjectId?: string) => {
        set((state) => ({ 
          timerStatus: 'running',
          selectedSubjectId: subjectId || state.selectedSubjectId,
          sessionStartTime: new Date()
        }));
      },
      
      pauseTimer: () => {
        set({ timerStatus: 'paused' });
      },
      
      resetTimer: () => {
        const { timerMode } = get();
        const timeMap = {
          pomodoro: POMODORO_TIME,
          'short-break': SHORT_BREAK_TIME,
          'long-break': LONG_BREAK_TIME,
          free: 0, // Cronômetro reseta para zero
        };
        
        set({
          timeRemaining: timeMap[timerMode],
          timerStatus: 'idle',
          sessionStartTime: null,
        });
      },
      
      completeSessionOld: () => {
        const state = get();
        const { timerMode, currentSession, completedToday } = state;
        
        if (timerMode === 'pomodoro') {
          // XP baseado na sessão completa
          const xpGained = 25;
          const newCompletedToday = completedToday + 1;
          const newTotalSessions = state.totalSessions + 1;
          
          set((state) => ({
            completedToday: newCompletedToday,
            totalSessions: newTotalSessions,
            currentStreak: newCompletedToday,
          }));
          
          // Adicionar XP
          get().addXP(xpGained);
          
          // Próximo modo baseado na sessão
          const nextMode = currentSession % 4 === 0 ? 'long-break' : 'short-break';
          get().setTimerMode(nextMode);
          
          set({ currentSession: currentSession + 1 });
        } else {
          // Volta para pomodoro após pausa
          get().setTimerMode('pomodoro');
        }
      },
      
      setTimerMode: (mode: TimerMode) => {
        const timeMap = {
          pomodoro: POMODORO_TIME,
          'short-break': SHORT_BREAK_TIME,
          'long-break': LONG_BREAK_TIME,
          free: 0, // Cronômetro começa do zero
        };
        
        set({
          timerMode: mode,
          timeRemaining: timeMap[mode],
          timerStatus: 'idle',
          sessionStartTime: null,
        });
      },
      
      setCurrentPage: (page: string) => {
        set({ currentPage: page });
      },

      setSelectedSubject: (id: string | null) => {
        set({ selectedSubjectId: id });
      },
      
      addXP: (amount: number) => {
        set((state) => {
          const newXP = state.xp + amount;
          let newLevel = state.level;
          let newXPToNextLevel = state.xpToNextLevel;
          
          // Calcular level up
          while (newXP >= newXPToNextLevel) {
            newLevel += 1;
            newXPToNextLevel = newLevel * 100; // 100 XP por level
          }
          
          return {
            xp: newXP,
            level: newLevel,
            xpToNextLevel: newXPToNextLevel,
          };
        });
      },

      completeSession: () => {
        // Implementação vazia por agora - lógica movida para TimerCard
      },

      completeCurrentSession: () => {
        set((state) => ({
          ...state,
          timerStatus: 'idle',
          sessionStartTime: null,
        }));
      },
      
      // Subjects management moved to Supabase hooks
      
      addTask: (task) => {
        set((state) => ({
          tasks: [
            ...state.tasks,
            {
              ...task,
              id: Date.now().toString(),
              createdAt: new Date(),
            },
          ],
        }));
      },
      
      toggleTask: (id: string) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, completed: !task.completed } : task
          ),
        }));
      },
      
      deleteTask: (id: string) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        }));
      },
    }),
    {
      name: 'studoro-storage',
    }
  )
);