import { StarField } from '@/components/StarField';
import { StudoroSidebar } from '@/components/StudoroSidebar';
import { TimerCard } from '@/components/TimerCard';

const Index = () => {
  return (
    <div className="flex min-h-screen bg-background overflow-hidden">
      {/* Animated Background */}
      <StarField />
      
      {/* Sidebar */}
      <StudoroSidebar />
      
      {/* Main Content */}
      <div className="flex-1 relative">
        <TimerCard />
      </div>
    </div>
  );
};

export default Index;
