import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { apiRequest } from '../lib/api';

export interface Notification {
  id: string | number;
  title: string;
  message: string;
  type: 'warning' | 'error' | 'info' | 'success';
  category?: 'low_stock' | 'out_of_stock' | 'delivery_approaching' | 'delivery_overdue' | 'delivery_arrived';
  timestamp: Date;
  read: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string | number) => void;
  markAllAsRead: () => void;
  clearNotification: (id: string | number) => void;
  unreadCount: number;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Fetch notifications from the backend
  const fetchNotifications = async () => {
    try {
      console.log('[Notifications] Attempting to fetch from /api/notifications');
      const response = await apiRequest<{ data: any[] }>('/notifications');
      console.log('[Notifications] Response received:', response);
      
      if (response && response.data && Array.isArray(response.data)) {
        const formattedNotifications: Notification[] = response.data.map((notif: any) => ({
          id: notif.id,
          title: notif.title,
          message: notif.message,
          type: notif.type || 'info',
          category: notif.category,
          timestamp: new Date(notif.created_at),
          read: notif.read,
        }));
        console.log('[Notifications] Formatted notifications:', formattedNotifications);
        setNotifications(formattedNotifications);
      } else {
        console.warn('[Notifications] Unexpected response format:', response);
      }
    } catch (error) {
      console.error('[Notifications] Failed to fetch notifications:', error);
    }
  };

  // Fetch notifications on mount and periodically
  useEffect(() => {
    console.log('NotificationProvider mounted, fetching initial notifications');
    fetchNotifications();
    const interval = setInterval(() => {
      console.log('Fetching notifications periodically');
      fetchNotifications();
    }, 30000); // Every 30 seconds
    return () => {
      clearInterval(interval);
    };
  }, []);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString() + Math.random().toString(36),
      timestamp: new Date(),
      read: false,
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = async (id: string | number) => {
    try {
      await apiRequest(`/notifications/${id}/mark-as-read`, {
        method: 'PATCH',
      });
      setNotifications(prev =>
        prev.map(notif => (notif.id === id ? { ...notif, read: true } : notif))
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await apiRequest('/notifications/mark-all-as-read', {
        method: 'POST',
      });
      setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const clearNotification = async (id: string | number) => {
    try {
      await apiRequest(`/notifications/${id}`, {
        method: 'DELETE',
      });
      setNotifications(prev => prev.filter(notif => notif.id !== id));
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotification,
        unreadCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
