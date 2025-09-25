import { Download, FileText, Table } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Papa from 'papaparse';
import type { Subject, StudySession } from '@/hooks/useSupabaseSync';

interface ExportControlsProps {
  subjects: Subject[];
  sessions: StudySession[];
  profile: any;
}

export const ExportControls = ({ subjects, sessions, profile }: ExportControlsProps) => {
  
  const exportToPDF = async () => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    
    // Título
    pdf.setFontSize(20);
    pdf.text('Relatório de Estudos - Studoro', pageWidth / 2, 20, { align: 'center' });
    
    // Data
    pdf.setFontSize(12);
    pdf.text(`Gerado em: ${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR })}`, 20, 35);
    
    // Informações do usuário
    pdf.setFontSize(14);
    pdf.text('Informações Gerais', 20, 50);
    
    pdf.setFontSize(10);
    let yPos = 60;
    pdf.text(`Usuário: ${profile?.username || 'Usuário'}`, 20, yPos);
    yPos += 7;
    pdf.text(`Nível: ${profile?.current_level || 1}`, 20, yPos);
    yPos += 7;
    pdf.text(`XP Total: ${profile?.total_xp || 0}`, 20, yPos);
    yPos += 7;
    pdf.text(`Sequência Atual: ${profile?.current_streak || 0} dias`, 20, yPos);
    yPos += 7;
    pdf.text(`Melhor Sequência: ${profile?.longest_streak || 0} dias`, 20, yPos);
    
    // Estatísticas gerais
    const totalHours = sessions.reduce((sum, s) => sum + s.duration_minutes, 0) / 60;
    const totalSessions = sessions.length;
    
    yPos += 15;
    pdf.setFontSize(14);
    pdf.text('Estatísticas de Estudo', 20, yPos);
    
    yPos += 10;
    pdf.setFontSize(10);
    pdf.text(`Total de Horas Estudadas: ${totalHours.toFixed(1)}h`, 20, yPos);
    yPos += 7;
    pdf.text(`Total de Sessões: ${totalSessions}`, 20, yPos);
    yPos += 7;
    pdf.text(`Média por Sessão: ${totalSessions > 0 ? (totalHours * 60 / totalSessions).toFixed(0) : 0} min`, 20, yPos);
    
    // Matérias
    if (subjects.length > 0) {
      yPos += 15;
      pdf.setFontSize(14);
      pdf.text('Desempenho por Matéria', 20, yPos);
      
      yPos += 10;
      pdf.setFontSize(10);
      
      subjects
        .sort((a, b) => b.total_study_time - a.total_study_time)
        .slice(0, 10) // Top 10 matérias
        .forEach(subject => {
          if (yPos > 270) { // Nova página se necessário
            pdf.addPage();
            yPos = 20;
          }
          
          const hours = (subject.total_study_time / 60).toFixed(1);
          pdf.text(`${subject.name}: ${hours}h (${subject.total_sessions} sessões)`, 20, yPos);
          yPos += 7;
        });
    }
    
    // Salvar PDF
    pdf.save(`studoro-relatorio-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
  };

  const exportToCSV = () => {
    // Preparar dados das sessões
    const csvData = sessions.map(session => {
      const subject = subjects.find(s => s.id === session.subject_id);
      return {
        'Data/Hora': format(new Date(session.started_at), 'dd/MM/yyyy HH:mm', { locale: ptBR }),
        'Matéria': subject?.name || 'Desconhecida',
        'Tipo': session.session_type === 'pomodoro' ? 'Pomodoro' : 
                session.session_type === 'free' ? 'Cronômetro Livre' : 'Pausa',
        'Duração (min)': session.duration_minutes,
        'XP Ganho': session.xp_earned || 0,
        'Início': format(new Date(session.started_at), 'HH:mm', { locale: ptBR }),
        'Fim': format(new Date(session.ended_at), 'HH:mm', { locale: ptBR }),
      };
    });

    // Gerar CSV
    const csv = Papa.unparse(csvData, {
      delimiter: ';',
      header: true
    });

    // Download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `studoro-sessoes-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportSubjectsCSV = () => {
    // Preparar dados das matérias
    const csvData = subjects.map(subject => ({
      'Matéria': subject.name,
      'Ícone': subject.icon,
      'Cor': subject.color,
      'Meta Semanal (h)': subject.target_hours_per_week,
      'Total de Horas': (subject.total_study_time / 60).toFixed(1),
      'Total de Sessões': subject.total_sessions,
      'Criada em': format(new Date(subject.created_at), 'dd/MM/yyyy', { locale: ptBR })
    }));

    const csv = Papa.unparse(csvData, {
      delimiter: ';',
      header: true
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `studoro-materias-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="glass rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
        <Download className="w-5 h-5 mr-2 text-primary" />
        Exportar Dados
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button
          onClick={exportToPDF}
          variant="outline"
          className="flex items-center justify-center space-x-2"
        >
          <FileText className="w-4 h-4" />
          <span>Relatório PDF</span>
        </Button>
        
        <Button
          onClick={exportToCSV}
          variant="outline"
          className="flex items-center justify-center space-x-2"
        >
          <Table className="w-4 h-4" />
          <span>Sessões CSV</span>
        </Button>
        
        <Button
          onClick={exportSubjectsCSV}
          variant="outline"
          className="flex items-center justify-center space-x-2"
        >
          <Table className="w-4 h-4" />
          <span>Matérias CSV</span>
        </Button>
      </div>
      
      <p className="text-xs text-muted-foreground mt-4">
        Os arquivos incluem todos os seus dados de estudo e podem ser importados em outras ferramentas de análise.
      </p>
    </div>
  );
};