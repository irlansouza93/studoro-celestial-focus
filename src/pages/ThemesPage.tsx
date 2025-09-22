import { Palette, Check } from 'lucide-react';
import { useState } from 'react';

const themes = [
  {
    id: 'space',
    name: 'Espacial',
    description: 'Tema padrão com gradiente roxo-azul',
    preview: 'linear-gradient(135deg, hsl(258, 84%, 24%) 0%, hsl(252, 100%, 35%) 100%)',
    colors: {
      primary: '#3b82f6',
      accent: '#fbbf24',
    }
  },
  {
    id: 'forest',
    name: 'Floresta',
    description: 'Verde natural e relaxante',
    preview: 'linear-gradient(135deg, #134e4a 0%, #166534 100%)',
    colors: {
      primary: '#10b981',
      accent: '#84cc16',
    }
  },
  {
    id: 'sunset',
    name: 'Pôr do Sol',
    description: 'Laranja e rosa calorosos',
    preview: 'linear-gradient(135deg, #dc2626 0%, #ea580c 100%)',
    colors: {
      primary: '#f97316',
      accent: '#fbbf24',
    }
  },
  {
    id: 'ocean',
    name: 'Oceano',
    description: 'Azuis profundos e calmos',
    preview: 'linear-gradient(135deg, #164e63 0%, #1e40af 100%)',
    colors: {
      primary: '#0ea5e9',
      accent: '#06b6d4',
    }
  },
  {
    id: 'lavender',
    name: 'Lavanda',
    description: 'Roxo suave e elegante',
    preview: 'linear-gradient(135deg, #581c87 0%, #7c3aed 100%)',
    colors: {
      primary: '#8b5cf6',
      accent: '#a855f7',
    }
  },
  {
    id: 'dark',
    name: 'Escuro',
    description: 'Preto e cinza minimalista',
    preview: 'linear-gradient(135deg, #111827 0%, #374151 100%)',
    colors: {
      primary: '#6b7280',
      accent: '#f59e0b',
    }
  },
];

export const ThemesPage = () => {
  const [selectedTheme, setSelectedTheme] = useState('space');

  const applyTheme = (theme: typeof themes[0]) => {
    // Por enquanto apenas visual, depois implementar persistência
    setSelectedTheme(theme.id);
    
    // Aqui seria onde aplicaríamos as mudanças CSS
    document.documentElement.style.setProperty('--primary', theme.colors.primary);
    document.documentElement.style.setProperty('--accent', theme.colors.accent);
  };

  return (
    <div className="flex items-start justify-center min-h-screen p-8">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Temas</h1>
          <p className="text-muted-foreground">Personalize a aparência do seu Studoro</p>
        </div>

        {/* Current Theme */}
        <div className="glass rounded-2xl p-6 mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Palette className="w-6 h-6 text-accent" />
            <h2 className="text-lg font-semibold text-white">Tema Atual</h2>
          </div>
          
          <div className="flex items-center space-x-4">
            <div 
              className="w-16 h-16 rounded-lg border-2 border-primary"
              style={{ background: themes.find(t => t.id === selectedTheme)?.preview }}
            />
            <div>
              <h3 className="font-medium text-white">
                {themes.find(t => t.id === selectedTheme)?.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {themes.find(t => t.id === selectedTheme)?.description}
              </p>
            </div>
          </div>
        </div>

        {/* Theme Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {themes.map((theme) => (
            <div
              key={theme.id}
              className={`glass rounded-lg p-6 cursor-pointer transition-all duration-200 hover:scale-105 ${
                selectedTheme === theme.id 
                  ? 'border-2 border-primary' 
                  : 'hover:border-primary/50'
              }`}
              onClick={() => applyTheme(theme)}
            >
              {/* Theme Preview */}
              <div 
                className="w-full h-24 rounded-lg mb-4 relative overflow-hidden"
                style={{ background: theme.preview }}
              >
                {/* Mini UI Preview */}
                <div className="absolute inset-4 space-y-2">
                  <div 
                    className="w-8 h-8 rounded-full opacity-80"
                    style={{ backgroundColor: theme.colors.primary }}
                  />
                  <div className="space-y-1">
                    <div className="w-full h-1 bg-white/20 rounded" />
                    <div className="w-3/4 h-1 bg-white/30 rounded" />
                  </div>
                  <div 
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: theme.colors.accent }}
                  />
                </div>
                
                {/* Check icon for selected theme */}
                {selectedTheme === theme.id && (
                  <div className="absolute top-2 right-2">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}
              </div>
              
              {/* Theme Info */}
              <h3 className="font-semibold text-white mb-1">{theme.name}</h3>
              <p className="text-sm text-muted-foreground">{theme.description}</p>
              
              {/* Color Palette */}
              <div className="flex space-x-2 mt-3">
                <div 
                  className="w-4 h-4 rounded-full border border-border"
                  style={{ backgroundColor: theme.colors.primary }}
                />
                <div 
                  className="w-4 h-4 rounded-full border border-border"
                  style={{ backgroundColor: theme.colors.accent }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Additional Options */}
        <div className="glass rounded-lg p-6 mt-8">
          <h3 className="text-lg font-semibold text-white mb-4">Opções de Personalização</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-white">Animações</h4>
                <p className="text-sm text-muted-foreground">Efeitos visuais e transições</p>
              </div>
              <button className="w-12 h-6 bg-primary rounded-full relative">
                <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 transition-transform" />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-white">Partículas de Fundo</h4>
                <p className="text-sm text-muted-foreground">Estrelas flutuantes animadas</p>
              </div>
              <button className="w-12 h-6 bg-primary rounded-full relative">
                <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 transition-transform" />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-white">Sons</h4>
                <p className="text-sm text-muted-foreground">Notificações sonoras</p>
              </div>
              <button className="w-12 h-6 bg-muted rounded-full relative">
                <div className="w-5 h-5 bg-white rounded-full absolute left-0.5 top-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};