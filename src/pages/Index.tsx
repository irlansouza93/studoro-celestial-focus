import { StarField } from '@/components/StarField';
import { StudoroSidebar } from '@/components/StudoroSidebar';
import { StudoroApp } from '@/components/StudoroApp';

const Index = () => {
  return (
    <div className="flex min-h-screen bg-background overflow-hidden">
      {/* Animated Background */}
      <StarField />
      
      {/* Sidebar */}
      <StudoroSidebar />
      
      {/* Main Content */}
      <StudoroApp />
    </div>
  );
};

export default Index;
