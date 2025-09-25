import { Settings, Clock, Zap, Bell, User, Download, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useStudoroStore } from '@/hooks/useStudoroStore';

export const SettingsPage = () => {
  const [pomodoroTime, setPomodoroTime] = useState(25);
  const [shortBreakTime, setShortBreakTime] = useState(5);
  const [longBreakTime, setLongBreakTime] = useState(15);
  const [autoStartBreaks, setAutoStartBreaks] = useState(false);
  const [autoStartPomodoros, setAutoStartPomodoros] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);

  const { totalSessions, completedToday, level, xp } = useStudoroStore();

  const resetAllData = () => {
    if (confirm('Tem certeza que deseja resetar todos os dados? Esta ação não pode ser desfeita.')) {
      // Reset do store
      localStorage.removeItem('studoro-storage');
      window.location.reload();
    }
  };

  const exportData = () => {
    const data = localStorage.getItem('studoro-storage');
    if (data) {
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `studoro-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result as string;
          localStorage.setItem('studoro-storage', data);
          window.location.reload();
        } catch (error) {
          alert('Erro ao importar dados. Verifique se o arquivo está correto.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="h-screen overflow-y-auto">
      <div className="flex items-start justify-center min-h-screen p-8">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Configurações</h1>
          <p className="text-muted-foreground">Personalize sua experiência de estudo</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Timer Settings */}
          <div className="glass rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Clock className="w-6 h-6 text-accent" />
              <h2 className="text-lg font-semibold text-white">Configurações do Timer</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Duração do Pomodoro (minutos)
                </label>
                <Input
                  type="number"
                  value={pomodoroTime}
                  onChange={(e) => setPomodoroTime(Number(e.target.value))}
                  className="bg-secondary border-border text-white"
                  min="1"
                  max="60"
                />
              </div>
              
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Pausa curta (minutos)
                </label>
                <Input
                  type="number"
                  value={shortBreakTime}
                  onChange={(e) => setShortBreakTime(Number(e.target.value))}
                  className="bg-secondary border-border text-white"
                  min="1"
                  max="30"
                />
              </div>
              
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Pausa longa (minutos)
                </label>
                <Input
                  type="number"
                  value={longBreakTime}
                  onChange={(e) => setLongBreakTime(Number(e.target.value))}
                  className="bg-secondary border-border text-white"
                  min="1"
                  max="60"
                />
              </div>
            </div>
          </div>

          {/* Automation Settings */}
          <div className="glass rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Zap className="w-6 h-6 text-accent" />
              <h2 className="text-lg font-semibold text-white">Automação</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-white">Iniciar pausas automaticamente</h4>
                  <p className="text-sm text-muted-foreground">Pausas começam sozinhas após Pomodoro</p>
                </div>
                <button 
                  onClick={() => setAutoStartBreaks(!autoStartBreaks)}
                  className={`w-12 h-6 rounded-full relative transition-colors ${
                    autoStartBreaks ? 'bg-primary' : 'bg-muted'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                    autoStartBreaks ? 'right-0.5' : 'left-0.5'
                  }`} />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-white">Iniciar Pomodoros automaticamente</h4>
                  <p className="text-sm text-muted-foreground">Pomodoros começam após pausas</p>
                </div>
                <button 
                  onClick={() => setAutoStartPomodoros(!autoStartPomodoros)}
                  className={`w-12 h-6 rounded-full relative transition-colors ${
                    autoStartPomodoros ? 'bg-primary' : 'bg-muted'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                    autoStartPomodoros ? 'right-0.5' : 'left-0.5'
                  }`} />
                </button>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="glass rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Bell className="w-6 h-6 text-accent" />
              <h2 className="text-lg font-semibold text-white">Notificações</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-white">Notificações push</h4>
                  <p className="text-sm text-muted-foreground">Avisos quando timer termina</p>
                </div>
                <button 
                  onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                  className={`w-12 h-6 rounded-full relative transition-colors ${
                    notificationsEnabled ? 'bg-primary' : 'bg-muted'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                    notificationsEnabled ? 'right-0.5' : 'left-0.5'
                  }`} />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-white">Sons</h4>
                  <p className="text-sm text-muted-foreground">Tocar som ao finalizar timer</p>
                </div>
                <button 
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`w-12 h-6 rounded-full relative transition-colors ${
                    soundEnabled ? 'bg-primary' : 'bg-muted'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                    soundEnabled ? 'right-0.5' : 'left-0.5'
                  }`} />
                </button>
              </div>
            </div>
          </div>

          {/* Account Info */}
          <div className="glass rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-6">
              <User className="w-6 h-6 text-accent" />
              <h2 className="text-lg font-semibold text-white">Perfil</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Level atual</span>
                <span className="text-lg font-bold text-white">{level}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">XP total</span>
                <span className="text-lg font-bold text-white">{xp}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Sessões hoje</span>
                <span className="text-lg font-bold text-white">{completedToday}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total de sessões</span>
                <span className="text-lg font-bold text-white">{totalSessions}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="glass rounded-lg p-6 mt-6">
          <div className="flex items-center space-x-3 mb-6">
            <Download className="w-6 h-6 text-accent" />
            <h2 className="text-lg font-semibold text-white">Gerenciar Dados</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={exportData}
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar Dados
            </Button>
            
            <div className="relative">
              <input
                type="file"
                accept=".json"
                onChange={importData}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Button
                variant="outline"
                className="w-full border-primary text-primary hover:bg-primary hover:text-white"
              >
                <Download className="w-4 h-4 mr-2 rotate-180" />
                Importar Dados
              </Button>
            </div>
            
            <Button
              onClick={resetAllData}
              variant="outline"
              className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Resetar Tudo
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground mt-4 text-center">
            Faça backup dos seus dados regularmente. O reset apaga todas as estatísticas, matérias e tarefas.
          </p>
        </div>
      </div>
      </div>
    </div>
  );
};