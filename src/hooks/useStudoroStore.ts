import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TimerMode = 'pomodoro' | 'short-break' | 'long-break';
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
  
  // Matérias
  subjects: Array<{
    id: string;
    name: string;
    icon: string;
    color: string;
    sessionsCompleted: number;
    timeSpent: number; // em minutos
  }>;
  
  // Tarefas
  tasks: Array<{
    id: string;
    title: string;
    completed: boolean;
    subjectId?: string;
    priority: 'low' | 'medium' | 'high';
    createdAt: Date;
  }>;
  
  // Actions
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  completeSession: () => void;
  setTimerMode: (mode: TimerMode) => void;
  setCurrentPage: (page: string) => void;
  addXP: (amount: number) => void;
  addSubject: (subject: Omit<StudoroState['subjects'][0], 'id' | 'sessionsCompleted' | 'timeSpent'>) => void;
  updateSubject: (id: string, updates: Partial<StudoroState['subjects'][0]>) => void;
  deleteSubject: (id: string) => void;
  addTask: (task: Omit<StudoroState['tasks'][0], 'id' | 'createdAt'>) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
}

const POMODORO_TIME = 25 * 60; // 25 minutos
const SHORT_BREAK_TIME = 5 * 60; // 5 minutos
const LONG_BREAK_TIME = 15 * 60; // 15 minutos

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
      
      subjects: [
        {
          id: '1',
          name: 'Matemática',
          icon: '📊',
          color: '#3b82f6',
          sessionsCompleted: 0,
          timeSpent: 0,
        },
        {
          id: '2',
          name: 'Português',
          icon: '📚',
          color: '#10b981',
          sessionsCompleted: 0,
          timeSpent: 0,
        },
      ],
      
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
      
      // Actions
      startTimer: () => {
        set({ timerStatus: 'running' });
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
        };
        
        set({
          timeRemaining: timeMap[timerMode],
          timerStatus: 'idle',
        });
      },
      
      completeSession: () => {
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
        };
        
        set({
          timerMode: mode,
          timeRemaining: timeMap[mode],
          timerStatus: 'idle',
        });
      },
      
      setCurrentPage: (page: string) => {
        set({ currentPage: page });
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
      
      addSubject: (subject) => {
        set((state) => ({
          subjects: [
            ...state.subjects,
            {
              ...subject,
              id: Date.now().toString(),
              sessionsCompleted: 0,
              timeSpent: 0,
            },
          ],
        }));
      },
      
      updateSubject: (id: string, updates) => {
        set((state) => ({
          subjects: state.subjects.map((subject) =>
            subject.id === id ? { ...subject, ...updates } : subject
          ),
        }));
      },
      
      deleteSubject: (id: string) => {
        set((state) => ({
          subjects: state.subjects.filter((subject) => subject.id !== id),
        }));
      },
      
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