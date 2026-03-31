import { useEffect, useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { useNotifications, Notification } from '../contexts/notification-context';
import { Button } from './ui/button';
import { X } from 'lucide-react';

export function NotificationPopup() {
  const { notifications, markAsRead, clearNotification } = useNotifications();
  const [visibleAlerts, setVisibleAlerts] = useState<Set<string | number>>(new Set());
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string | number>>(new Set());

  // Show critical notifications as popups
  const criticalNotifications = notifications.filter(
    (n) => (n.type === 'error' || n.type === 'warning') && !n.read && !dismissedAlerts.has(n.id)
  );

  const currentAlert = criticalNotifications[0];

  const handleAcknowledge = (id: string | number) => {
    markAsRead(id);
    setDismissedAlerts((prev) => new Set([...prev, id]));
  };

  const handleDismiss = (id: string | number) => {
    setDismissedAlerts((prev) => new Set([...prev, id]));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <AlertTriangle className="h-6 w-6 text-red-600" />;
      case 'warning':
        return <AlertCircle className="h-6 w-6 text-yellow-600" />;
      case 'info':
        return <Info className="h-6 w-6 text-blue-600" />;
      default:
        return <AlertCircle className="h-6 w-6 text-gray-600" />;
    }
  };

  return (
    <>
      {/* Critical Alert Popup */}
      {currentAlert && (
        <AlertDialog open={true}>
          <AlertDialogContent className={`${
            currentAlert.type === 'error' ? 'border-red-500 bg-red-50' :
            currentAlert.type === 'warning' ? 'border-yellow-500 bg-yellow-50' :
            'border-blue-500 bg-blue-50'
          }`}>
            <AlertDialogHeader className="flex flex-row items-start gap-4">
              <div className="mt-1">
                {getIcon(currentAlert.type)}
              </div>
              <div className="flex-1">
                <AlertDialogTitle className={`${
                  currentAlert.type === 'error' ? 'text-red-900' :
                  currentAlert.type === 'warning' ? 'text-yellow-900' :
                  'text-blue-900'
                }`}>
                  {currentAlert.title}
                </AlertDialogTitle>
                <AlertDialogDescription className={`mt-2 ${
                  currentAlert.type === 'error' ? 'text-red-700' :
                  currentAlert.type === 'warning' ? 'text-yellow-700' :
                  'text-blue-700'
                }`}>
                  {currentAlert.message}
                </AlertDialogDescription>
              </div>
            </AlertDialogHeader>
            <div className="flex gap-3 justify-end">
              <AlertDialogCancel onClick={() => handleDismiss(currentAlert.id)}>
                Dismiss
              </AlertDialogCancel>
              <AlertDialogAction onClick={() => handleAcknowledge(currentAlert.id)}>
                Acknowledge
              </AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* Non-Critical Alerts Summary */}
      {notifications.length > 0 && (
        <div className="fixed bottom-4 right-4 space-y-2 z-40 max-w-md">
          {notifications
            .filter((n) => !dismissedAlerts.has(n.id))
            .slice(0, 3)
            .map((notification) => (
              <Alert
                key={notification.id}
                variant={notification.type === 'error' ? 'destructive' : 'default'}
                className={`${
                  notification.type === 'error' ? 'border-red-500 bg-red-50' :
                  notification.type === 'warning' ? 'border-yellow-500 bg-yellow-50' :
                  'border-blue-500 bg-blue-50'
                } animate-in slide-in-from-right`}
              >
                <div className="flex items-start justify-between w-full gap-2">
                  <div className="flex items-start gap-2 flex-1">
                    {getIcon(notification.type)}
                    <div className="flex-1">
                      <AlertTitle className={`${
                        notification.type === 'error' ? 'text-red-900' :
                        notification.type === 'warning' ? 'text-yellow-900' :
                        'text-blue-900'
                      }`}>
                        {notification.title}
                      </AlertTitle>
                      <AlertDescription className={`text-sm ${
                        notification.type === 'error' ? 'text-red-700' :
                        notification.type === 'warning' ? 'text-yellow-700' :
                        'text-blue-700'
                      }`}>
                        {notification.message}
                      </AlertDescription>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDismiss(notification.id)}
                    className="h-5 w-5 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </Alert>
            ))}
        </div>
      )}
    </>
  );
}
