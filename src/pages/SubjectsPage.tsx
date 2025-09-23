import { useState } from 'react';
import { Plus, Trash2, BookOpen, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSupabaseSync } from '@/hooks/useSupabaseSync';

const availableIcons = ['📚', '📊', '🧮', '🔬', '🎨', '💻', '🌍', '🏛️', '🎵', '⚽', '📝', '🔍'];
const availableColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];

export const SubjectsPage = () => {
  const { subjects, addSubject, updateSubject, deleteSubject } = useSupabaseSync();
  const [newSubjectName, setNewSubjectName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('📚');
  const [selectedColor, setSelectedColor] = useState('#3b82f6');
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAddSubject = () => {
    if (newSubjectName.trim()) {
      addSubject({
        name: newSubjectName,
        icon: selectedIcon,
        color: selectedColor,
      });
      setNewSubjectName('');
      setSelectedIcon('📚');
      setSelectedColor('#3b82f6');
    }
  };

  const handleUpdateSubject = async (id: string, name: string) => {
    if (name.trim()) {
      await updateSubject(id, { name });
      setEditingId(null);
    }
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}min`;
    }
    return `${mins}min`;
  };

  return (
    <div className="flex items-start justify-center min-h-screen p-8">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Matérias</h1>
          <p className="text-muted-foreground">Organize seus estudos por disciplina</p>
        </div>

        {/* Add Subject Form */}
        <div className="glass rounded-2xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">Nova Matéria</h2>
          
          <div className="space-y-4">
            <Input
              placeholder="Nome da matéria..."
              value={newSubjectName}
              onChange={(e) => setNewSubjectName(e.target.value)}
              className="bg-secondary border-border text-white placeholder:text-muted-foreground"
              onKeyPress={(e) => e.key === 'Enter' && handleAddSubject()}
            />
            
            <div className="space-y-3">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Ícone</label>
                <div className="flex flex-wrap gap-2">
                  {availableIcons.map((icon) => (
                    <button
                      key={icon}
                      onClick={() => setSelectedIcon(icon)}
                      className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center text-lg transition-all ${
                        selectedIcon === icon
                          ? 'border-primary bg-primary/20'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Cor</label>
                <div className="flex flex-wrap gap-2">
                  {availableColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        selectedColor === color
                          ? 'border-white scale-110'
                          : 'border-border hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            <Button 
              onClick={handleAddSubject}
              className="w-full bg-primary hover:bg-primary-hover"
              disabled={!newSubjectName.trim()}
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Matéria
            </Button>
          </div>
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.length === 0 ? (
            <div className="col-span-full glass rounded-lg p-8 text-center">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhuma matéria cadastrada ainda.</p>
              <p className="text-sm text-muted-foreground mt-2">
                Adicione sua primeira matéria acima!
              </p>
            </div>
          ) : (
            subjects.map((subject) => (
              <div
                key={subject.id}
                className="glass rounded-lg p-6 hover:scale-105 transition-transform duration-200"
                style={{ borderLeft: `4px solid ${subject.color}` }}
              >
                <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{subject.icon}</span>
                {editingId === subject.id ? (
                  <Input
                    defaultValue={subject.name}
                    className="bg-secondary border-border text-white text-sm"
                    onBlur={(e) => handleUpdateSubject(subject.id, e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleUpdateSubject(subject.id, e.currentTarget.value);
                      }
                    }}
                    autoFocus
                  />
                ) : (
                  <h3 
                    className="font-semibold text-white cursor-pointer"
                    onClick={() => setEditingId(subject.id)}
                  >
                    {subject.name}
                  </h3>
                )}
              </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteSubject(subject.id)}
                    className="text-muted-foreground hover:text-red-400 hover:bg-red-400/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Sessões completadas</span>
                    <span className="text-white font-medium">{subject.total_sessions}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      Tempo total
                    </span>
                    <span className="text-white font-medium">
                      {formatTime(subject.total_study_time)}
                    </span>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-300"
                        style={{ 
                          backgroundColor: subject.color,
                          width: `${Math.min((subject.total_sessions / 10) * 100, 100)}%`
                        }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 text-center">
                      {subject.total_sessions}/10 sessões para próximo nível
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};