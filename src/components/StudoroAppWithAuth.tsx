import { AuthGuard } from './AuthGuard';
import { StudoroApp } from './StudoroApp';
import { StudoroSidebar } from './StudoroSidebar';
import { StarField } from './StarField';
import { Toaster } from '@/components/ui/sonner';

export const StudoroAppWithAuth = () => {
  return (
    <AuthGuard>
      <div className="min-h-screen flex">
        <StarField />
        <StudoroSidebar />
        <StudoroApp />
        <Toaster />
      </div>
    </AuthGuard>
  );
};