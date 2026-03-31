import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AuthProvider } from './contexts/auth-context';
import { NotificationProvider } from './contexts/notification-context';
import { Toaster } from './components/ui/sonner';

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <RouterProvider router={router} />
        <Toaster />
      </NotificationProvider>
    </AuthProvider>
  );
}