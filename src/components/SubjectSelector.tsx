import { useState } from 'react';
import { ChevronDown, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSupabaseSync } from '@/hooks/useSupabaseSync';
import { useStudoroStore } from '@/hooks/useStudoroStore';

export const SubjectSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { subjects } = useSupabaseSync();
  const { selectedSubjectId, setSelectedSubject, setCurrentPage } = useStudoroStore();

  const selectedSubject = subjects.find(s => s.id === selectedSubjectId);

  const handleSelectSubject = (subjectId: string) => {
    setSelectedSubject(subjectId);
    setIsOpen(false);
  };

  const handleCreateSubject = () => {
    setCurrentPage('subjects');
    setIsOpen(false);
  };

  if (subjects.length === 0) {
    return (
      <div className="glass rounded-lg p-4 text-center">
        <p className="text-muted-foreground text-sm mb-3">
          Nenhuma matéria cadastrada
        </p>
        <Button
          onClick={handleCreateSubject}
          variant="outline" 
          size="sm"
          className="border-primary text-primary hover:bg-primary hover:text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Criar Primeira Matéria
        </Button>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="glass rounded-lg p-4 w-full flex items-center justify-between hover:bg-secondary/50 transition-colors"
      >
        <div className="flex items-center space-x-3">
          {selectedSubject ? (
            <>
              <span className="text-2xl">{selectedSubject.icon}</span>
              <div className="text-left">
                <h3 className="font-medium text-white">{selectedSubject.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {selectedSubject.total_sessions} sessões • {Math.round(selectedSubject.total_study_time / 60)}h
                </p>
              </div>
            </>
          ) : (
            <>
              <span className="text-2xl">📚</span>
              <div className="text-left">
                <h3 className="font-medium text-white">Selecionar Matéria</h3>
                <p className="text-xs text-muted-foreground">Escolha o que estudar</p>
              </div>
            </>
          )}
        </div>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 glass rounded-lg overflow-hidden z-50 max-h-64 overflow-y-auto">
          {subjects.map((subject) => (
            <button
              key={subject.id}
              onClick={() => handleSelectSubject(subject.id)}
              className="w-full p-3 flex items-center space-x-3 hover:bg-secondary/50 transition-colors border-b border-border last:border-b-0"
            >
              <span className="text-xl">{subject.icon}</span>
              <div className="flex-1 text-left">
                <h4 className="font-medium text-white text-sm">{subject.name}</h4>
                <p className="text-xs text-muted-foreground">
                  {subject.total_sessions} sessões • {Math.round(subject.total_study_time / 60)}h
                </p>
              </div>
              {selectedSubjectId === subject.id && (
                <div className="w-2 h-2 rounded-full bg-primary"></div>
              )}
            </button>
          ))}
          
          <button
            onClick={handleCreateSubject}
            className="w-full p-3 flex items-center space-x-3 hover:bg-secondary/50 transition-colors text-primary"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium text-sm">Criar Nova Matéria</span>
          </button>
        </div>
      )}
    </div>
  );
};