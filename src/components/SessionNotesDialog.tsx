import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface SessionNotesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (notes: SessionNotes) => void;
  sessionDuration: number;
  subjectName: string;
}

export interface SessionNotes {
  notes: string;
  mood: string;
  hadExercises: boolean;
  correctAnswers?: number;
  wrongAnswers?: number;
}

export const SessionNotesDialog = ({ 
  open, 
  onOpenChange, 
  onSave, 
  sessionDuration, 
  subjectName 
}: SessionNotesDialogProps) => {
  const [notes, setNotes] = useState('');
  const [mood, setMood] = useState('good');
  const [hadExercises, setHadExercises] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState('');
  const [wrongAnswers, setWrongAnswers] = useState('');

  const handleSave = () => {
    const sessionNotes: SessionNotes = {
      notes,
      mood,
      hadExercises,
      correctAnswers: hadExercises ? parseInt(correctAnswers) || 0 : undefined,
      wrongAnswers: hadExercises ? parseInt(wrongAnswers) || 0 : undefined,
    };

    onSave(sessionNotes);
    
    // Reset form
    setNotes('');
    setMood('good');
    setHadExercises(false);
    setCorrectAnswers('');
    setWrongAnswers('');
    
    toast.success('Sessão registrada com sucesso!');
    onOpenChange(false);
  };

  const moodOptions = [
    { value: 'excellent', label: '😄 Excelente', color: 'text-green-400' },
    { value: 'good', label: '😊 Bom', color: 'text-blue-400' },
    { value: 'neutral', label: '😐 Neutro', color: 'text-yellow-400' },
    { value: 'tired', label: '😴 Cansado', color: 'text-orange-400' },
    { value: 'frustrated', label: '😤 Frustrado', color: 'text-red-400' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">Registrar Sessão</DialogTitle>
          <p className="text-muted-foreground text-sm">
            {subjectName} • {sessionDuration} minutos
          </p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Anotações */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-white">Anotações da Sessão</Label>
            <Textarea
              id="notes"
              placeholder="O que você estudou? Quais conceitos aprendeu?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          {/* Estado/Humor */}
          <div className="space-y-3">
            <Label className="text-white">Como você se sente após esta sessão?</Label>
            <RadioGroup value={mood} onValueChange={setMood}>
              {moodOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label 
                    htmlFor={option.value} 
                    className={`cursor-pointer ${option.color}`}
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Exercícios */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="exercises"
                checked={hadExercises}
                onChange={(e) => setHadExercises(e.target.checked)}
                className="rounded border-border"
              />
              <Label htmlFor="exercises" className="text-white">
                Fiz exercícios durante esta sessão
              </Label>
            </div>

            {hadExercises && (
              <div className="grid grid-cols-2 gap-4 pl-6">
                <div className="space-y-2">
                  <Label htmlFor="correct" className="text-sm text-muted-foreground">
                    Acertos
                  </Label>
                  <Input
                    id="correct"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={correctAnswers}
                    onChange={(e) => setCorrectAnswers(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="wrong" className="text-sm text-muted-foreground">
                    Erros
                  </Label>
                  <Input
                    id="wrong"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={wrongAnswers}
                    onChange={(e) => setWrongAnswers(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Botões */}
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Pular
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1"
            >
              Salvar Sessão
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};