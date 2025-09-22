import { useState } from 'react';
import { Plus, Trash2, Circle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useStudoroStore } from '@/hooks/useStudoroStore';

export const TasksPage = () => {
  const { tasks, subjects, addTask, toggleTask, deleteTask } = useStudoroStore();
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      addTask({
        title: newTaskTitle,
        completed: false,
        subjectId: selectedSubject || undefined,
        priority: selectedPriority,
      });
      setNewTaskTitle('');
      setSelectedSubject('');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-muted-foreground';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Média';
      case 'low': return 'Baixa';
      default: return 'Média';
    }
  };

  return (
    <div className="flex items-start justify-center min-h-screen p-8">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Tarefas</h1>
          <p className="text-muted-foreground">Organize suas atividades de estudo</p>
        </div>

        {/* Add Task Form */}
        <div className="glass rounded-2xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">Nova Tarefa</h2>
          
          <div className="space-y-4">
            <Input
              placeholder="Digite o título da tarefa..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="bg-secondary border-border text-white placeholder:text-muted-foreground"
              onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="bg-secondary border border-border rounded-md px-3 py-2 text-white"
              >
                <option value="">Selecionar matéria</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.icon} {subject.name}
                  </option>
                ))}
              </select>
              
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value as 'low' | 'medium' | 'high')}
                className="bg-secondary border border-border rounded-md px-3 py-2 text-white"
              >
                <option value="low">Prioridade Baixa</option>
                <option value="medium">Prioridade Média</option>
                <option value="high">Prioridade Alta</option>
              </select>
            </div>
            
            <Button 
              onClick={handleAddTask}
              className="w-full bg-primary hover:bg-primary-hover"
              disabled={!newTaskTitle.trim()}
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Tarefa
            </Button>
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-4">
          {tasks.length === 0 ? (
            <div className="glass rounded-lg p-8 text-center">
              <p className="text-muted-foreground">Nenhuma tarefa cadastrada ainda.</p>
              <p className="text-sm text-muted-foreground mt-2">
                Adicione sua primeira tarefa acima!
              </p>
            </div>
          ) : (
            tasks.map((task) => {
              const subject = subjects.find(s => s.id === task.subjectId);
              return (
                <div
                  key={task.id}
                  className={`glass rounded-lg p-4 transition-all duration-200 ${
                    task.completed ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1">
                      <button
                        onClick={() => toggleTask(task.id)}
                        className="text-primary hover:text-primary-hover transition-colors"
                      >
                        {task.completed ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          <Circle className="w-5 h-5" />
                        )}
                      </button>
                      
                      <div className="flex-1">
                        <h3 className={`font-medium ${
                          task.completed ? 'line-through text-muted-foreground' : 'text-white'
                        }`}>
                          {task.title}
                        </h3>
                        
                        <div className="flex items-center space-x-4 mt-1">
                          {subject && (
                            <span className="text-sm text-muted-foreground">
                              {subject.icon} {subject.name}
                            </span>
                          )}
                          <span className={`text-xs font-medium ${getPriorityColor(task.priority)}`}>
                            {getPriorityLabel(task.priority)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteTask(task.id)}
                      className="text-muted-foreground hover:text-red-400 hover:bg-red-400/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};