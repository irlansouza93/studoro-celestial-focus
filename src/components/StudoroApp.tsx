import { useStudoroStore } from '@/hooks/useStudoroStore';
import { TimerCard } from './TimerCard';
import { TasksPage } from '@/pages/TasksPage';
import { SubjectsPage } from '@/pages/SubjectsPage';
import { StatsPage } from '@/pages/StatsPage';
import { ThemesPage } from '@/pages/ThemesPage';
import { SettingsPage } from '@/pages/SettingsPage';

export const StudoroApp = () => {
  const { currentPage } = useStudoroStore();

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'timer':
        return <TimerCard />;
      case 'tasks':
        return <TasksPage />;
      case 'subjects':
        return <SubjectsPage />;
      case 'stats':
        return <StatsPage />;
      case 'themes':
        return <ThemesPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <TimerCard />;
    }
  };

  return <div className="flex-1 relative">{renderCurrentPage()}</div>;
};