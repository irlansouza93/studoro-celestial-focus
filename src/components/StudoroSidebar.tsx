import { Timer, CheckSquare, BarChart3, Palette, Settings, Menu, X, BookOpen } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useStudoroStore } from '@/hooks/useStudoroStore';

interface MenuItem {
  icon: typeof Timer;
  label: string;
  page: string;
}

const menuItems: MenuItem[] = [
  { icon: Timer, label: 'Timer', page: 'timer' },
  { icon: CheckSquare, label: 'Tarefas', page: 'tasks' },
  { icon: BookOpen, label: 'Matérias', page: 'subjects' },
  { icon: BarChart3, label: 'Estatísticas', page: 'stats' },
  { icon: Palette, label: 'Temas', page: 'themes' },
  { icon: Settings, label: 'Configurações', page: 'settings' },
];

export const StudoroSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { 
    currentPage, 
    setCurrentPage, 
    level, 
    xp, 
    xpToNextLevel, 
    completedToday, 
    currentStreak 
  } = useStudoroStore();

  return (
    <div className={`sidebar-glass h-screen transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    } flex flex-col`}>
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Timer className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Studoro</h1>
                <p className="text-xs text-muted-foreground">Pomodoro Produtividade</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-muted-foreground hover:text-white hover:bg-secondary"
          >
            {isCollapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Progress Section */}
      {!isCollapsed && (
        <div className="p-4 border-b border-white/10">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Level {level}</span>
              <span className="text-sm text-muted-foreground">{xp} XP</span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-accent to-yellow-400 transition-all duration-300" 
                style={{ width: `${(xp / xpToNextLevel) * 100}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4">
            <div className="text-center">
              <div className="text-lg font-bold text-white">{completedToday}</div>
              <div className="text-xs text-muted-foreground">Sessões hoje</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-white">{currentStreak}</div>
              <div className="text-xs text-muted-foreground">Sequência</div>
            </div>
          </div>
        </div>
      )}

      {/* Menu Items */}
      <nav className="flex-1 p-2">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.page;
            return (
              <button
                key={item.label}
                onClick={() => setCurrentPage(item.page)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-primary/20 text-primary border border-primary/30'
                    : 'text-muted-foreground hover:text-white hover:bg-secondary'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};